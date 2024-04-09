import { db, type IBookmarkDb } from './db';
import backend from '$lib/state/backend.svelte';
import { liveQuery } from 'dexie';
import { writable } from 'svelte/store';

export const bookmarksStore = writable<IBookmarkDb[]>([]);

export async function loadData() {
    if (!backend.loading && backend.data.some) {
        const backendData = backend.data.val;
        const existingData = await db.bookmarks.toArray();

        if (backendData) {
            const result = await backendData.get();
            if (result.ok) {
                const backendBookmarks = result.val;
                const mergedBookmarks = mergeBookmarks(existingData, backendBookmarks);
                await db.bookmarks.clear();
                await db.bookmarks.bulkPut(mergedBookmarks);
                bookmarksStore.set(mergedBookmarks);
            } else {
                console.error('Fehler beim Laden der Lesezeichen:', result.val);
                bookmarksStore.set(existingData);
            }
        } else {
            console.error('Kein Backend verfügbar');
            bookmarksStore.set(existingData);
        }
    } else {
        console.log("Backend wird noch geladen...");
        bookmarksStore.set(await db.bookmarks.toArray());
    }
}

function mergeBookmarks(existingBookmarks: IBookmarkDb[], backendBookmarks: IBookmarkDb[]): IBookmarkDb[] {
    const mergedBookmarks = [...existingBookmarks];

    backendBookmarks.forEach(backendBookmark => {
        const existingBookmark = existingBookmarks.find(bookmark => bookmark.id === backendBookmark.id);

        if (existingBookmark) {
            // Merge tags
            const mergedTags = [...new Set([...existingBookmark.tags, ...backendBookmark.tags])];
            existingBookmark.tags = mergedTags;
        } else {
            mergedBookmarks.push(backendBookmark);
        }
    });

    return mergedBookmarks;
}

export async function loadDataFromBackend() {
    const backendData = backend.data;
    const existingData = await db.bookmarks.toArray();

    if (existingData.length === 0) {
        if (backendData.some) {
            const result = await backendData.val.get();
            if (result.ok) {
                await db.bookmarks.bulkPut(result.val);
                bookmarksStore.set(result.val);
            } else {
                console.error('Fehler beim Laden der Lesezeichen:', result.val);
            }
        } else {
            console.error('Kein Backend verfügbar');
        }
    } else {
        console.log('Verwende vorhandene Daten aus IndexedDB');
        bookmarksStore.set(existingData);
    }
}

export async function saveBookmark(bookmark: IBookmarkDb) {
    try {
        await db.bookmarks.add(bookmark);
        console.log('Lesezeichen gespeichert:', bookmark);
        bookmarksStore.update(bookmarks => [...bookmarks, bookmark]);
    } catch (error) {
        console.error('Fehler beim Speichern des Lesezeichens:', error);
    }
}

export async function updateBookmark(id: number, changes: Partial<IBookmarkDb>) {
    try {
        await db.bookmarks.update(id, changes);
        console.log(`Lesezeichen ${id} aktualisiert`);
        bookmarksStore.update(bookmarks => bookmarks.map(bookmark => bookmark.id === id ? { ...bookmark, ...changes } : bookmark));
    } catch (error) {
        console.error(`Fehler beim Aktualisieren des Lesezeichens ${id}:`, error);
    }
}

export async function deleteBookmark(id: number) {
    try {
        await db.bookmarks.delete(id);
        console.log(`Lesezeichen ${id} gelöscht`);
        bookmarksStore.update(bookmarks => {
            const index = bookmarks.findIndex(bookmark => bookmark.id === id);
            if (index !== -1) {
                bookmarks.splice(index, 1);
            }
            return bookmarks;
        });
    } catch (error) {
        console.error(`Fehler beim Löschen des Lesezeichens ${id}:`, error);
    }
}

const bookmarksQuery = () => liveQuery(() => db.bookmarks.toArray());

export { bookmarksQuery };