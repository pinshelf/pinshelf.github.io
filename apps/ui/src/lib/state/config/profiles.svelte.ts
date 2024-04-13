// Imports /////////////////////////////////////////////////////////////////////
import { ProfileSchema, type Profile } from '$lib/types';
import localStorage from '$lib/utils/local-storage';
import { z } from 'zod';
import { Result, Ok, Err } from 'ts-results';
import { homescreen } from '../data';

// Constants ///////////////////////////////////////////////////////////////////
const LS_KEY_PROFILES = 'profiles' as const;
const LS_KEY_ACTIVE_PROFILE = 'active-profiles' as const;

// State Initialization ////////////////////////////////////////////////////////
let profiles = $state<Profile[]>([]);
let activeProfileName = $state<string | undefined>();
const activeProfile = $derived(profiles.find(p => p.name === activeProfileName));


// Load from local storage
(() => {
    // Get profile list from localstorage
    const list = localStorage.read(LS_KEY_PROFILES, z.array(ProfileSchema))
    if (list.err) { return }

    profiles = list.val

    // Get active profile from localstorage
    const active = localStorage.read(LS_KEY_ACTIVE_PROFILE, z.object({
        name: z.string().or(z.undefined())
    }))
    if (active.err) {
        activeProfileName = undefined
        localStorage.write(LS_KEY_ACTIVE_PROFILE, { name: undefined })
        return
    }

    // Check if the active profile exists
    if (list.val.find(p => p.name === active.val.name)) {
        activeProfileName = active.val.name

    } else {
        localStorage.write(LS_KEY_ACTIVE_PROFILE, { name: undefined })
    }

    console.log(
        'Profiles loaded from LocalStorage: ',
        `amount = ${profiles.length}  |  active = "${activeProfileName}"`
    )
})();

// Functions ///////////////////////////////////////////////////////////////////
/**
 * Get all profiles.
 */
function all() { return profiles }

/**
 * Get active profile
 */
function active() { return activeProfile }

/**
 * Get profile by name
 */
function get(name: string): Result<Profile, string> {
    const profile: Profile | undefined = profiles.find(p => p.name === name);

    if (profile) {
        return Ok(profile)

    } else {
        return Err(`No profile with name "${name}" found.`)
    }
}

/**
 * Add profile
 */
function add(profile: Profile): Result<null, string> {
    // Check if name is already taken
    if (profiles.find(p => p.name === profile.name)) {
        return Err(`There's already a profile of name "${profile.name}".`)
    }

    // Add profile and write it to localStorage
    profiles.push(profile)
    const result = localStorage.write(LS_KEY_PROFILES, profiles)
    if (result.err) {
        // Remove it from the state again.
        profiles.pop();

        // Return error
        return Err(`Failed to save profile to localStorage: ${result.val}`);
    }

    // Return on success
    return Ok(null)
}

/**
 * Update profile
 */
function update(name: string, newData: Profile): Result<null, string> {
    // Try to find profile with the given name
    const index = profiles.findIndex(p => p.name === name)
    if (index === -1) {
        return Err(`No profile of name "${name}" found.`)
    }

    // Extract profile from array by index
    const profile = profiles.splice(index, 1)[0]

    // Check if another profile already has the new name
    if (profiles.find(p => p.name === newData.name)) {
        return Err(`Another profile already has the name "${newData.name}".`)
    }

    // Add the new profile into the state
    profiles.splice(index, 0, newData);

    // Write to localStorage
    const result = localStorage.write(LS_KEY_PROFILES, profiles)
    if (result.err) {
        // Revert change in state
        profiles.splice(index, 1, profile)

        return Err(`Failed to save changes to localStorage: ${result.val}`);
    }

    // Return
    return Ok(null)
}

/**
 * Remove profile
 */
function remove(name: string) {
    // Copy profiles and remove profile on the copy
    let copy = [...profiles];
    copy = copy.filter(p => p.name !== name);

    // Try to save modified copy in localstorage
    const result = localStorage.write(LS_KEY_PROFILES, copy)
    if (result.err) { return }

    // If modified copy was written successfully update the state
    profiles = copy;

    // Check if the removed profile was the active profile
    if (activeProfileName === name) {
        activeProfileName = undefined
        localStorage.write(LS_KEY_ACTIVE_PROFILE, { name: undefined })
    }
}

/**
 * Set active
 */
function setActive(name: string) {
    const result = profiles.find(p => p.name === name)

    if (result) {
        activeProfileName = name
        localStorage.write(LS_KEY_ACTIVE_PROFILE, { name })
    }

    console.log(`Profile changed: now active "${activeProfileName}`)
}

////////////////////////////////////////////////////////////////////////////////
export default {
    // Getter
    get all() { return all() },
    get active() { return active() },

    // Functions
    get: get,
    add: add,
    update: update,
    remove: remove,
    setActive: setActive,
}

////////////////////////////////////////////////////////////////////////////////
