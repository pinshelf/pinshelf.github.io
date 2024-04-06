<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import '../app.pcss';
    import { ModeWatcher } from 'mode-watcher'
    import * as Toolbar from '$lib/components/custom/toolbar'
    import * as Pager from '$lib/components/custom/pager'
    import { Dialog } from '$lib/components/custom/dialog';
    import { ManageProfiles } from '$lib/components/custom/manage-profiles';

    // Stores //////////////////////////////////////////////////////////////////
    import profiles from '$lib/state/profiles.svelte';

    // State ///////////////////////////////////////////////////////////////////
    let pages = $state<{ name: string }[]>([
        { name: "Personal" },
        { name: "Finances" },
    ])

    let activePage = $state<string>("Personal")

    let manageProfilesDialogOpen = $state(false)

    // Functions ///////////////////////////////////////////////////////////////
    function onProfileChange(profileName: string) {
        profiles.setActive(profileName)
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
