/*
 * The "config" state contains multiple reactive states which all somewhat
 * belong to the current local configuration of the application.
 *
 * First there is the "profiles" state, which contains all the profiles the user
 * created. These profiles are persisted to the local storage and are
 * automatically loaded when the application starts.
 *
 * The "activeProfile" state references the currently selected/active profile
 * and is also automatically persisted/loaded to/from the local storage.
 *
 * The "backend" state is automatically set when the "activeProfile" changes.
 * The "backend" state contains the backend implementation belonging to the
 * currently selected profile.
 * For example, if the active profile uses xBrowserSync, the "backend" state
 * contains an xBrowserSync client fully initialized and ready to make requests.
 */

import profiles from './profiles.svelte'
import backend from './backend.svelte'

export {
    profiles,
    backend,
}
