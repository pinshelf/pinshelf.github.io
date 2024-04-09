// Imports /////////////////////////////////////////////////////////////////////
import type { IBookmark } from '$lib/backends';
import type { Option } from 'ts-results';
import { toOption } from 'ts-results-utils';
import { backend } from '../config'

// State ///////////////////////////////////////////////////////////////////////
let bookmarks = $state<IBookmark[]>([])

// Functions ///////////////////////////////////////////////////////////////////
function findById(id: number): Option<IBookmark> {
    const b = bookmarks.find(b => b.id === id)
    return toOption(b)
}

async function load() {
    // Get backend
    const be = backend.data;
    if (be.none) {
        console.log('wanted to load bookmarks but backend not set yet')
        return
    }

    // Load bookmarks
    const b = await be.val.get()
    if (b.err) {
        console.log(`error while fetching bookmarks: ${b.val}`)
        return
    }

    // Update state
    bookmarks = b.val
    console.log(`fetched ${bookmarks.length} bookmarks`)
    console.log(bookmarks)
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get all() { return bookmarks },

    load: load,
    findById: findById,
}

////////////////////////////////////////////////////////////////////////////////
