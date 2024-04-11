// Imports /////////////////////////////////////////////////////////////////////
import type { Page, App, Control, Divider, } from '$lib/types'
import { homescreen } from '.'
import { v4 as uuidv4 } from 'uuid';

// Mock Data ///////////////////////////////////////////////////////////////////
// TODO: remove
const mock: Page[] = [
    {
        title: 'Start',
        grid: [
            // Group
            {
                type: 'app',
                id: '0',
                bookmarkId: 11,
                overwrites: {
                    title: 'Ross-Tech'
                }
            },
            {
                type: 'app',
                id: '1',
                bookmarkId: 12,
                // overwrites: {},
            },

            {
                type: 'app',
                id: '352434',
                bookmarkId: 12,
                // overwrites: {},
            },

            {
                type: 'app',
                id: '352323',
                bookmarkId: 12,
                // overwrites: {},
            },

            // Divider
            {
                type: 'divider',
                id: '100',
                title: 'Internet Search'
            },

            // Group
            {
                type: 'app',
                id: '2',
                bookmarkId: 3,
            },
            {
                type: 'app',
                id: '3',
                bookmarkId: 9,
                overwrites: {
                    title: 'DDG 2',
                }
            },
            {
                type: 'app',
                id: '4',
                bookmarkId: 13,
            },
        ]
    },

    {
        title: 'Second',
        grid: [
            // Divider
            {
                type: 'divider',
                id: '123',
                title: 'I\'m a divider',
            },

            // Group
            {
                type: 'app',
                id: '2',
                bookmarkId: 3,
            },
        ],
    },

    {
        title: 'a',
        grid: [],
    },

    {
        title: 'b',
        grid: [],
    },

    {
        title: 'c',
        grid: [],
    },

    {
        title: 'd',
        grid: [],
    },

    {
        title: 'e',
        grid: [],
    },
]

// State ///////////////////////////////////////////////////////////////////////
// Storeas all pages
let pages = $state<Page[]>(mock)

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

// Functions ///////////////////////////////////////////////////////////////////
function setActivePage(index: number) {
    currentPageIndex = index
}

function controls(enabled: boolean) {
    if (enabled) {
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


    // for (const x of currentPage.grid) {
    //     if (x.type === 'divider') continue

    //     if (enabled) {
    //         x.items.push({ id: '__ADD__' })
    //     } else {
    //         x.items = x.items.filter(i => i.id !== '__ADD__')
    //     }
    // }
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

function addApp(app: App) {

}

function removeItem() {
    controls(false)

    homescreen.currentPage.grid = homescreen.currentPage.grid
        .filter(x => x.id !== selectedForEdit)

    controls(true)
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get pages() { return pages },
    set pages(p: Page[]) { pages = p },

    get currentPage() { return currentPage },

    get editMode() { return editMode },
    set editMode(m: boolean) { editMode = m; controls(m) },

    get selectedForEdit() { return selectedForEdit },
    set selectedForEdit(s: string | undefined){ selectedForEdit = s },

    get controlId() { return controlId },
    set controlId(s: string | undefined) { controlId = s },

    setActivePage: setActivePage,
    moveApp: moveApp,
    addDivider: addDivider,
    removeItem: removeItem,
}

////////////////////////////////////////////////////////////////////////////////
