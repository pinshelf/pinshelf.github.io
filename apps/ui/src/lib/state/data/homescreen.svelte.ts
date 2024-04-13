// Imports /////////////////////////////////////////////////////////////////////
import type { Page, App, Divider } from '$lib/types'
import { bookmarks, homescreen } from '.'
import { v4 as uuidv4 } from 'uuid';
import { backend } from '../config';

// Constants ///////////////////////////////////////////////////////////////////
const DEFAULT_PAGES = [
    {
        title: 'Default',
        grid: [],
    }
]

// State ///////////////////////////////////////////////////////////////////////
// Storeas all pages
let pages = $state<Page[]>(DEFAULT_PAGES)

// Current page index and current page define the curently active page
// This is used for showing the correct page as well as editing items.
let currentPageIndex = $state<number>(0)
const currentPage = $derived(pages[currentPageIndex])

// Stores state of edit mode (if in edit mode or not)
let editMode = $state<boolean>(false);

// Stores the id of the selected item
let selectedForEdit = $state<string | undefined>()

// Stores the id of the pressed control item (e.g. add button)
let controlId = $state<string | undefined>()

// Skip next homescreen initialization if change was commited from this instance
let skipNextHomescreenInit = $state<boolean>(false)

// Functions ///////////////////////////////////////////////////////////////////

/**
 * This function is called by the `bookmarks` state, if it re-fetched data.
 * Therefore we can then use the bookmark state to get the homescreen data.
 */
async function init() {
    if (skipNextHomescreenInit) {
        skipNextHomescreenInit = false
        console.log(
            'Homescreen initialization skipped, because latest change was',
            'done by this instance')
        return
    }

    // Extract settings (using the current backend and the already loaded
    // bookmark data).
    if (backend.data.none) {
        console.log('Homescreen NOT initialized: No backend set')
        return
    }

    const settings = backend.data.val.extractSettings(bookmarks.all)
    if (settings.err) {
        console.log(`Homescreen NOT initialized: ${settings.val}`)
        pages = DEFAULT_PAGES
        currentPageIndex = 0
        editMode = false
        selectedForEdit = undefined
        controlId = undefined
        skipNextHomescreenInit = false
        console.log('Loaded default/empty profile')
        return
    }

    // Set state from loaded settings
    pages = settings.val.homescreen.pages
    currentPageIndex = settings.val.homescreen.currentPageIndex

    editMode = false
    selectedForEdit = undefined
    controlId = undefined

    console.log('Homescreen initialized')
}

/**
 * This function is called by the root layout when the `homescreen` state
 * changes.
 */
async function save() {
    if (backend.data.none) {
        console.warn('Failed to save homescreen: No backend set')
        return
    }

    // Deep-copy pages and remove control elements
    const copy = JSON.parse(JSON.stringify(pages)) as Page []
    for (const page of copy) {
        page.grid = page.grid.filter(x => x.type !== 'control')
    }

    // Write settings
    const res = await backend.data.val.writeSettings({
        homescreen: {
            pages: copy,
            currentPageIndex: currentPageIndex,
        }
    })

    if (res.err) { return console.error(`Failed to save settings: ${res.val}`) }

    console.log('Homescreen saved!!!')
    skipNextHomescreenInit = true
}


function setActivePage(index: number) {
    currentPageIndex = index
    save()
}

function controls(enable: boolean) {
    if (enable) {
        const grid = currentPage.grid

        const insertionIndices: number[] = []

        for (let i = 0; i < grid.length; i++) {
            if (grid[i].type === 'divider') { insertionIndices.push(i) }
        }

        insertionIndices.push(grid.length)

        let offset = 0;
        for (const index of insertionIndices) {
            grid.splice(index + offset, 0, {
                type: 'control',
                id: uuidv4(),
                action: 'add',
            })
            offset += 1;
        }


        currentPage.grid = grid

    } else {
        currentPage.grid = currentPage.grid.filter(i => i.type !== 'control')
    }
}

function moveApp(id: string, direction: 'left' | 'right') {
    controls(false)

    const index = currentPage.grid.findIndex(i => {
        const item = i as (App | Divider)
        return item.id === id
    })

    if (index === -1) {
        controls(true)
        return
    }

    if (direction === 'left') {
        if (index === 0) {
            controls(true)
            return
        }

        const tmp = currentPage.grid[index - 1]
        currentPage.grid[index - 1] = currentPage.grid[index]
        currentPage.grid[index] = tmp
    }

    else if (direction === 'right') {
        if (index === currentPage.grid.length - 1) {
            controls(true);
            return
        }

        const tmp = currentPage.grid[index + 1]
        currentPage.grid[index + 1] = currentPage.grid[index]
        currentPage.grid[index] = tmp
    }

    controls(true)
}

function addDivider(title: string) {
    // Find control
    const controlIndex = homescreen.currentPage.grid
        .findIndex(x => x.id === controlId)

    if (controlIndex === -1) { return }

    // Add divider
    homescreen.currentPage.grid.splice(controlIndex, 0, {
        type: 'divider',
        id: uuidv4(),
        title
    })

    // Little hack
    controls(false)
    controls(true)
}

function addApp(partialApp: Omit<App, 'type' | 'id'>) {
    // Find control
    const controlIndex = currentPage.grid
        .findIndex(x => x.id === controlId)

    if (controlIndex === -1) { return }

    // Add app
    currentPage.grid.splice(controlIndex, 0, {
        type: 'app',
        id: uuidv4(),
        ...partialApp
    })
}

function removeItem() {
    controls(false)

    currentPage.grid = currentPage.grid
        .filter(x => x.id !== selectedForEdit)

    controls(true)
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get pages() { return pages },
    set pages(p: Page[]) { pages = p },

    get currentPage() { return currentPage },
    get currentPageIndex() { return currentPageIndex },

    get editMode() { return editMode },
    set editMode(m: boolean) { editMode = m; controls(m) },

    get selectedForEdit() { return selectedForEdit },
    set selectedForEdit(s: string | undefined){ selectedForEdit = s },

    get controlId() { return controlId },
    set controlId(s: string | undefined) { controlId = s },

    init: init,
    setActivePage: setActivePage,
    moveApp: moveApp,
    addDivider: addDivider,
    removeItem: removeItem,
    addApp: addApp,
    save: save,
}

////////////////////////////////////////////////////////////////////////////////
