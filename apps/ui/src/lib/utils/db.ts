import Dexie, { type Table, liveQuery } from 'dexie';
import type { IBookmark } from '$lib/backends';

const DB_VERSION = 1;
const BOOKMARKS_STORE_NAME = 'bookmarks';

class BookmarkDatabase extends Dexie {
    bookmarks!: Table<IBookmark>; 

    constructor() {
        super('BookmarkDatabase');
        this.version(DB_VERSION).stores({
            [BOOKMARKS_STORE_NAME]: '++id, url, title, *tags',
        });
    }
}

const db = new BookmarkDatabase();

export { db, liveQuery, type IBookmark };
