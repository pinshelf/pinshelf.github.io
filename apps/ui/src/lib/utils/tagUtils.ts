import { updateBookmark } from './dataService';
import type { IBookmark } from './db';

async function updateBookmarkTags(bookmark: IBookmark, updateFn: (tags: string[]) => string[]): Promise<IBookmark | null> {
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

export async function addNewTag(bookmark: IBookmark): Promise<IBookmark | null> {
    return updateBookmarkTags(bookmark, (tags) => [...tags, '']);
}

export async function deleteTag(bookmark: IBookmark, index: number): Promise<IBookmark | null> {
    return updateBookmarkTags(bookmark, (tags) => tags.filter((_, i) => i !== index));
}

export async function updateTag(bookmark: IBookmark, index: number, newTag: string): Promise<IBookmark | null> {
    return updateBookmarkTags(bookmark, (tags) => tags.map((tag, i) => i === index ? newTag : tag));
}