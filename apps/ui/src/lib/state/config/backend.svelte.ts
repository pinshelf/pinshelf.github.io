// Imports /////////////////////////////////////////////////////////////////////
import { Option, Some, None } from 'ts-results'
import { XbsBackendBuilder, RaindropBackendBuilder, type IBackend } from '$lib/backends'
import { profiles } from '.'

// Initialize State ////////////////////////////////////////////////////////////
const backend = $state<{ data: Option<IBackend> }>({ data: None })

// Functions ///////////////////////////////////////////////////////////////////
function get() {
    return backend.data
}

async function set() {
    // Create backend for the selected profile
    if (!profiles.active) {
        console.log('cannot set backend because no profile is active')
        return
    }

    if (profiles.active!.backend === 'xbs') {
        console.log('set backend xbs')

        // Re-authenticate
        const xbsBackend = await XbsBackendBuilder.auth(profiles.active!.credentials)
        if (xbsBackend.err) {
            console.log(`error: ${xbsBackend.val}`)
            return
        } // TODO: error handling

        // Write backend to store
        backend.data = Some(xbsBackend.val)

    } else if (profiles.active!.backend === 'raindrop') {
        console.log('set backend raindrop')

        // Re-authenticate
        const rdBackend = await RaindropBackendBuilder
            .auth(profiles.active!.credentials)

        if (rdBackend.err) {
            console.log(`error: ${rdBackend.val}`)
            return
        } // TODO: error handling

        // Write backend to state
        backend.data = Some(rdBackend.val)
    }
}

function unset() {
    backend.data = None
}

// Export //////////////////////////////////////////////////////////////////////
export default {
    // Getter
    get data() { return get() },

    // Functions
    set     : set,
    unset   : unset,
}

////////////////////////////////////////////////////////////////////////////////
