// Imports /////////////////////////////////////////////////////////////////////
import type { Page } from '$lib/types'
// import { v4 as uuidv4 } from 'uuid';

// Mock Data ///////////////////////////////////////////////////////////////////
// TODO: remove
const mock: Page[] = [
    {
        title: 'Start',
        grid: [
            // Group
            {
                apps: [
                    {
                        id: '0',
                        bookmarkId: 11,
                        overwrites: {
                            title: 'Ross-Tech'
                        }
                    },
                    {
                        id: '1',
                        bookmarkId: 12,
                        // overwrites: {},
                    }
                ]
            },

            // Divider
            {
                id: '100',
                title: 'Internet Search'
            },

            // Group
            {
                apps: [
                    {
                        id: '2',
                        bookmarkId: 3,
                    },
                    {
                        id: '3',
                        bookmarkId: 9,
                        overwrites: {
                            title: 'DDG 2',
                        }
                    },
                    {
                        id: '4',
                        bookmarkId: 13,
                    },
                ]
            },
        ]
    },

    {
        title: 'Second',
        grid: [
            // Divider
            {
                id: '123',
                title: 'I\'m a divider',
            },

            // Group
            {
                apps: [
                    {
                        id: '2',
                        bookmarkId: 3,
                    },
                ]
            },
        ],
    },
]

// State ///////////////////////////////////////////////////////////////////////
const pages = $state<Page[]>([])

let currentPageIndex = $state<number>(0)
const currentPage = $derived(pages[currentPageIndex])

let editMode = $state<boolean>(false);

let pendingChange = $state<boolean>(false)

// Functions ///////////////////////////////////////////////////////////////////
function setActivePage(index: number) {
    currentPageIndex = index
}

////////////////////////////////////////////////////////////////////////////////
export default {
    get pages() { return pages },
    get currentPage() { return currentPage },

    get editMode() { return editMode },
    set editMode(m: boolean) {
        editMode = m;
        if (!m) { pendingChange = true }
    },

    get pendingChange() { return pendingChange },
    set pendingChange(c: boolean) { pendingChange = c },

    setActivePage: setActivePage
}

////////////////////////////////////////////////////////////////////////////////
