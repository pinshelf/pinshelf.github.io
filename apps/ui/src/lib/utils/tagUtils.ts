import { updateBookmark } from './dataService';
import type { IBookmarkDb } from './db';

async function updateBookmarkTags(bookmark: IBookmarkDb, updateFn: (tags: string[]) => string[]): Promise<IBookmarkDb | null> {
    if (typeof bookmark.id === 'number') {
        const updatedTags = updateFn(bookmark.tags);
        const updatedBookmark = { ...bookmark, tags: updatedTags };
        await updateBookmark(bookmark.id, updatedBookmark);
        return updatedBookmark;
    } else {
        console.error('bookmark.id ist undefined');
        return null;
    }
}

export async function addNewTag(bookmark: IBookmarkDb): Promise<IBookmarkDb | null> {
    return updateBookmarkTags(bookmark, (tags) => [...tags, '']);
}

export async function deleteTag(bookmark: IBookmarkDb, index: number): Promise<IBookmarkDb | null> {
    return updateBookmarkTags(bookmark, (tags) => tags.filter((_, i) => i !== index));
}

export async function updateTag(bookmark: IBookmarkDb, index: number, newTag: string): Promise<IBookmarkDb | null> {
    return updateBookmarkTags(bookmark, (tags) => tags.map((tag, i) => i === index ? newTag : tag));
}