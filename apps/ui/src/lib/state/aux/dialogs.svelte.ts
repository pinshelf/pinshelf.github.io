// Imports /////////////////////////////////////////////////////////////////////

// Constants ///////////////////////////////////////////////////////////////////
const DIALOGS = ['manageProfiles', 'managePages', 'editApp', 'addApp'] as const;
type Dialog = (typeof DIALOGS)[number];

// State Initialization ////////////////////////////////////////////////////////
const dialogs = $state<{ [key in Dialog]: boolean }>({
    manageProfiles  : false,
    managePages     : false,
    editApp         : false,
    addApp          : false,
});

// Functions ///////////////////////////////////////////////////////////////////
function getActive() {
    let active: Dialog | null = null
    for (const d of DIALOGS) {
        if (dialogs[d]) {
            active = d
            break
        }
    }

    return active
}

function setActive(dialogKey: Dialog | null) {
    if (dialogKey === null) {
        for (const d of DIALOGS) {
            dialogs[d] = false
        }

    } else {
        for (const d of DIALOGS) {
            if (d === dialogKey) {
                dialogs[d] = true

            } else {
                dialogs[d] = false
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////
export default {
    // Getter, setter
    get active() { return getActive() },
    set active(dk: Dialog | null) { setActive(dk) },

    get manageProfiles() { return dialogs.manageProfiles },
    set manageProfiles(b: boolean) {
        if (b) { setActive('manageProfiles') }
        else { setActive(null) }
    },

    get managePages() { return dialogs.managePages },
    set managePages(b: boolean) {
        if (b) { setActive('managePages') }
        else { setActive(null) }
    },

    get editApp() { return dialogs.editApp },
    set editApp(b: boolean) {
        if (b) { setActive('editApp') }
        else { setActive(null) }
    },

    get addApp() { return dialogs.addApp },
    set addApp(b: boolean) {
        if (b) { setActive('addApp') }
        else { setActive(null) }
    },
}

////////////////////////////////////////////////////////////////////////////////
