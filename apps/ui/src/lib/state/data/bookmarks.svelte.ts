// Imports /////////////////////////////////////////////////////////////////////
import type { IBookmark } from '$lib/backends';
import type { Option } from 'ts-results';
import { toOption } from 'ts-results-utils';
import { backend } from '../config'
import { homescreen } from '.';

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
        console.log('Bookmarks NOT loaded: no backend set yet')
        return
    }

    // Load bookmarks
    const b = await be.val.get()
    if (b.err) {
        console.error(`Error while fetching bookmarks: ${b.val}`)
        return
    }

    // Update state
    bookmarks = b.val
    console.log(`Bookmarks loaded: amount = ${bookmarks.length}`)

    // Notify backend state about the last fetch to the backend
    backend.setLastFetch(Date.now())

    // Notify the homescreen to update its state
    await homescreen.init();
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get all() { return bookmarks },

    load: load,
    findById: findById,
}

////////////////////////////////////////////////////////////////////////////////
