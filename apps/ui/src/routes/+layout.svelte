<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import '../app.pcss';
    import { ModeWatcher } from 'mode-watcher'
    import * as Toolbar from '$lib/components/custom/toolbar'
    import * as Pager from '$lib/components/custom/pager'
    import { Dialog } from '$lib/components/custom/dialog';
    import { ManageProfiles } from '$lib/components/custom/manage-profiles';
    import { SearchBar } from '$lib/components/custom/search'

    // Stores //////////////////////////////////////////////////////////////////
    import profiles from '$lib/state/profiles.svelte';
    import backend from '$lib/state/backend.svelte';
    import { RaindropBackendBuilder, XbsBackendBuilder } from '$lib/backends';

    // State ///////////////////////////////////////////////////////////////////
    let pages = $state<{ name: string }[]>([
        { name: "Personal" },
        { name: "Finances" },
    ])

    let activePage = $state<string>("Personal")

    let manageProfilesDialogOpen = $state(false)

    // Mount ///////////////////////////////////////////////////////////////////
    $effect(() => {
        setBackend()
    })

    // Functions ///////////////////////////////////////////////////////////////
    async function onProfileChange(profileName: string) {
        profiles.setActive(profileName)
        await setBackend()
    }

    async function setBackend() {
        // Create backend for the selected profile
        if (!profiles.active) {
            console.log("cannot set backend because no profile is active")
            return
        }
        if (profiles.active!.backend === 'xbs') {
            console.log("set backend xbs")

            // Re-authenticate
            const xbsBackend = await XbsBackendBuilder.auth(profiles.active!.credentials)
            if (xbsBackend.err) {
                console.log(`error: ${xbsBackend.val}`)
                return
            } // TODO: error handling

            // Write backend to store
            backend.set(xbsBackend.val)

        } else if (profiles.active!.backend === 'raindrop') {
            console.log("set backend raindrop")

            // Re-authenticate
            const rdBackend = await RaindropBackendBuilder
                .auth(profiles.active!.credentials)

            if (rdBackend.err) {
                console.log(`error: ${rdBackend.val}`)
                return
            } // TODO: error handling

            // Write backend to state
            backend.set(rdBackend.val)
        }
    }

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->
<!-- Head -->
<svelte:head>
    <title>Pinshelf</title>
</svelte:head>

<!-- Light/Dark Mode -->
<ModeWatcher/>

<!-- Toolbar -->
<Toolbar.Root>
    {#snippet left()}
        <Toolbar.Menu
            profiles={profiles.all}
            activeProfile={profiles.active}
            onProfileChange={onProfileChange}
            bind:manageProfilesDialogOpen={manageProfilesDialogOpen}
        />
    {/snippet}

    {#snippet middle()}
        <!-- Searchbar -->
        <SearchBar />
    {/snippet}

    {#snippet right()}
        <Toolbar.Actions activeProfile={!!profiles.active} />
    {/snippet}
</Toolbar.Root>

<!-- Content -->
<slot/>

<!-- Pager -->
<Pager.Root>
    {#snippet left()}
        <Pager.Version/>
    {/snippet}

    {#snippet middle()}
        <Pager.Pagination
            pages={!!profiles.active ? pages : []}
            bind:activePage={activePage}
        />
    {/snippet}

    {#snippet right()}
        <Pager.Actions />
    {/snippet}
</Pager.Root>

<!-- Dialogs -->
<!-- Todo -->
<Dialog bind:open={manageProfilesDialogOpen}>
    <ManageProfiles
        profiles={profiles.all}
        onClose={() => manageProfilesDialogOpen = false}
    />
</Dialog>


<!-- ----------------------------------------------------------------------- -->
