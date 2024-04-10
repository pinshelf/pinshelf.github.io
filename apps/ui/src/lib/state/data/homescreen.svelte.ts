// Imports /////////////////////////////////////////////////////////////////////
import type { Page, App, Control, Divider, } from '$lib/types'
import { homescreen } from '.'
// import { v4 as uuidv4 } from 'uuid';

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
]

// State ///////////////////////////////////////////////////////////////////////
const pages = $state<Page[]>(mock)

let currentPageIndex = $state<number>(0)
const currentPage = $derived(pages[currentPageIndex])

let editMode = $state<boolean>(false);

// let pendingChange = $state<boolean>(false)

// Functions ///////////////////////////////////////////////////////////////////
function setActivePage(index: number) {
    currentPageIndex = index
}

function addButtons(enabled: boolean) {
    if (enabled) {
        const grid = currentPage.grid

        const insertionIndices: number[] = []

        for (let i = 0; i < grid.length; i++) {
            if (grid[i].type === 'divider') { insertionIndices.push(i) }
        }

        insertionIndices.push(grid.length)

        let offset = 0;
        for (const index of insertionIndices) {
            grid.splice(index + offset, 0, { type: 'control', action: 'add' })
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
    addButtons(false)

    const index = currentPage.grid.findIndex(i => {
        const item = i as (App | Divider)
        return item.id === id
    })

    if (index === -1) {
        addButtons(true)
        return
    }

    if (direction === 'left') {
        if (index === 0) {
            addButtons(true)
            return
        }

        const tmp = currentPage.grid[index - 1]
        currentPage.grid[index - 1] = currentPage.grid[index]
        currentPage.grid[index] = tmp
    }

    else if (direction === 'right') {
        if (index === currentPage.grid.length - 1) {
            addButtons(true);
            return
        }

        const tmp = currentPage.grid[index + 1]
        currentPage.grid[index + 1] = currentPage.grid[index]
        currentPage.grid[index] = tmp
    }

    addButtons(true)
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get pages() { return pages },
    get currentPage() { return currentPage },

    get editMode() { return editMode },
    set editMode(m: boolean) {
        editMode = m;
        addButtons(m)
        // if (!m) { pendingChange = true }
    },

    // get pendingChange() { return pendingChange },
    // set pendingChange(c: boolean) { pendingChange = c },

    setActivePage: setActivePage,
    moveApp: moveApp,
}

////////////////////////////////////////////////////////////////////////////////
