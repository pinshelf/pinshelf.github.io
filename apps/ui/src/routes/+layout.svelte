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
    import activeProfile from '$lib/state/active-profile.svelte';
    import { type Profile } from '$lib/types';
    activeProfile.init(profiles.all)

    // State ///////////////////////////////////////////////////////////////////
    let pages = $state<{ name: string }[]>([
        { name: "Personal" },
        { name: "Finances" },
    ])

    let activePage = $state<string>("Personal")

    let manageProfilesDialogOpen = $state(false)

    // Functions ///////////////////////////////////////////////////////////////
    function onProfileChange(profileName: string) {
        const profile = profiles.get(profileName)
        if (profile.ok) {
            activeProfile.set(profile.val)
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
            activeProfile={activeProfile.get}
            onProfileChange={onProfileChange}
            bind:manageProfilesDialogOpen={manageProfilesDialogOpen}
        />
    {/snippet}

    {#snippet middle()}
        <!-- Searchbar -->
    {/snippet}

    {#snippet right()}
        <Toolbar.Actions activeProfile={!!activeProfile} />
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
            pages={!!activeProfile.get ? pages : []}
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
