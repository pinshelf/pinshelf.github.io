// Imports /////////////////////////////////////////////////////////////////////
import { type Profile } from '$lib/types';
import localStorage from '$lib/utils/local-storage';
import { z } from 'zod';

// Constants ///////////////////////////////////////////////////////////////////
const LS_KEY = 'active-profile' as const;

// State Initialization ////////////////////////////////////////////////////////
let activeProfile = $state<Profile | null>(null);

// Functions ///////////////////////////////////////////////////////////////////
/**
 * Get active profile
 */
function get() { return activeProfile }

/**
 * Initialize active profile store
 */
function init(profiles: Profile[]) {
    // Read profile name from localstorage
    const result = localStorage.read(LS_KEY, z.string())
    if (result.err) { return }

    // Get profile from profiles array
    const p = profiles.find(p => p.name === result.val)
    if (p) {
        activeProfile = p;
    }
}

/**
 * Set active profile
 */
function set(profile: Profile) {
    activeProfile = profile
}



////////////////////////////////////////////////////////////////////////////////
export default {
    // Getter
    get get() { return get() },

    // Functions
    init: init,
    set: set,
}

////////////////////////////////////////////////////////////////////////////////
