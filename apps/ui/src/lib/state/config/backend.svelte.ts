// Imports /////////////////////////////////////////////////////////////////////
import { Option, Some, None } from 'ts-results'
import { XbsBackendBuilder, RaindropBackendBuilder, type IBackend } from '$lib/backends'
import { profiles } from '.'
import { bookmarks } from '../data'

// Initialize State ////////////////////////////////////////////////////////////
const backend = $state<{
    data: Option<IBackend>,
    lastFetch: number,
    lastRemoteUpdate: number,
}>({
    data: None,
    lastFetch: 0,
    lastRemoteUpdate: 0,
})

// Functions ///////////////////////////////////////////////////////////////////

async function set() {
    // Create backend for the selected profile
    if (!profiles.active) {
        console.log('Backend NOT set: no active profile')
        return
    }

    if (profiles.active!.backend === 'xbs') {
        // Re-authenticate
        const xbsBackend = await XbsBackendBuilder
            .auth(profiles.active!.credentials);

        if (xbsBackend.err) {
            console.error(`Error: ${xbsBackend.val}`)
            return
        } // TODO: error handling

        // Write backend to store
        backend.data = Some(xbsBackend.val)

    } else if (profiles.active!.backend === 'raindrop') {
        // Re-authenticate
        const rdBackend = await RaindropBackendBuilder
            .auth(profiles.active!.credentials)

        if (rdBackend.err) {
            console.error(`Error: ${rdBackend.val}`)
            return
        } // TODO: error handling

        // Write backend to state
        backend.data = Some(rdBackend.val)
    }

    console.log(`Backend set: variant = "${profiles.active.backend}"`)
}

function unset() {
    backend.data = None
}

function setLastFetch(unixTimestamp: number) {
    backend.lastFetch = unixTimestamp
}

function isOutOfDate(): boolean {
    return backend.lastFetch < backend.lastRemoteUpdate
}

// Background Tasks ////////////////////////////////////////////////////////////

/**
 * This background task continuously checks if the remote datasource has been
 * updated. If so, it notifies the `bookmarks` state to load new data, which
 * then also informse the `homescreen` state.
 */
(async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (backend.data.some) {
            // Extract backend client
            const b = backend.data.val

            // Get last updated value from backend
            const lastUpdated = await b.getLastUpdated()
            if (lastUpdated.ok) {
                // Set last remote update
                backend.lastRemoteUpdate = lastUpdated.val

                // console.log(backend.lastFetch)
                // console.log(backend.lastRemoteUpdate)

                // Check if we're out of date
                if (isOutOfDate()) {
                    // Notify `bookmarks` state to update its data
                    console.log(
                        'Local data out of date: Re-fetching from remote'
                    )
                    await bookmarks.load()
                }
            }

        }

        await new Promise((res) => setTimeout(res, 10_000))
    }
})()

// Export //////////////////////////////////////////////////////////////////////
export default {
    // Getter
    get data() { return backend.data },

    // Functions
    set         : set,
    unset       : unset,
    setLastFetch: setLastFetch,
    isOutOfDate : isOutOfDate,
}

////////////////////////////////////////////////////////////////////////////////
