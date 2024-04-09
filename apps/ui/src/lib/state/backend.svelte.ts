// Imports /////////////////////////////////////////////////////////////////////
import { Option, Some, None } from 'ts-results'
import { type IBackend } from '../backends'

// Initialize State ////////////////////////////////////////////////////////////
const backend = $state<{ data: Option<IBackend>, loading: boolean }>({ data: None, loading: true })

// Functions ///////////////////////////////////////////////////////////////////
function get() {
    return backend.data
}

function set(apiClient: IBackend) {
    backend.data = Some(apiClient)
}

function unset() {
    backend.data = None
}

function setLoading(isLoading: boolean) {
    backend.loading = isLoading;
}

// Export //////////////////////////////////////////////////////////////////////
export default {
    // Getter
    get data() { return get() },
    get loading() { return backend.loading },

    // Functions
    set: set,
    unset: unset,
    setLoading: setLoading,
}

////////////////////////////////////////////////////////////////////////////////
