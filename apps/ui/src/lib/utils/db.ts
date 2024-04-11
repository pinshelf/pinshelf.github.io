import Dexie, { type Table, liveQuery } from 'dexie';
import type { IBookmark } from '$lib/backends';

const DB_VERSION = 1;
const BOOKMARKS_STORE_NAME = 'bookmarks';

interface IBookmarkDb extends IBookmark {
    id: number;
}

class BookmarkDatabase extends Dexie {
    bookmarks!: Table<IBookmarkDb>; 

    constructor() {
        super('BookmarkDatabase');
        this.version(DB_VERSION).stores({
            [BOOKMARKS_STORE_NAME]: '++id, url, title, *tags',
        });
    }
}

const db = new BookmarkDatabase();

export { db, liveQuery, type IBookmarkDb };