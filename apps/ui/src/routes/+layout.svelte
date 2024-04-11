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
    import { ManagePages, EditApp, AddItemDialog, EditDivider } from '$lib/components/custom/homescreen'
    import { page } from '$app/stores';

    // Stores //////////////////////////////////////////////////////////////////
    import { profiles, backend } from '$lib/state/config';
    import { dialogs } from '$lib/state/aux';

    // State ///////////////////////////////////////////////////////////////////

    const currentRoute = $derived($page.url.pathname)

    // Mount ///////////////////////////////////////////////////////////////////
    $effect(() => { backend.set() })

    // Functions ///////////////////////////////////////////////////////////////
    async function onProfileChange(profileName: string) {
        profiles.setActive(profileName)
        backend.set()
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
            bind:manageProfilesDialogOpen={dialogs.manageProfiles}
        />
    {/snippet}

    {#snippet middle()}
        {#if currentRoute === "/"}
            <SearchBar />
        {/if}
    {/snippet}

    {#snippet right()}
        <Toolbar.Actions activeProfile={!!profiles.active} />
    {/snippet}
</Toolbar.Root>

<!-- Content -->
<div class="
    fixed w-full h-dvh pt-10 pb-20 sm:pt-16 sm:pb-10
    flex justify-center
">
    <!-- Content Wrapper -->
    <div class="
        w-full max-w-5xl h-full py-4 px-2
        overflow-x-visible
        overflow-y-auto
    ">
        <slot/>
    </div>
</div>


<!-- Pager -->
<Pager.Root>
    {#snippet left()}
        <Pager.Version/>
    {/snippet}

    {#snippet middle()}
        <Pager.Pagination/>
    {/snippet}

    {#snippet right()}
        <Pager.Actions/>
    {/snippet}
</Pager.Root>

<!-- Dialogs -->
<Dialog bind:open={dialogs.manageProfiles}>
    <ManageProfiles
        profiles={profiles.all}
        onClose={() => dialogs.manageProfiles = false}
    />
</Dialog>

<Dialog bind:open={dialogs.managePages}>
    <ManagePages />
</Dialog>

<Dialog bind:open={dialogs.editApp}>
    <EditApp />
</Dialog>

<Dialog bind:open={dialogs.editDivider}>
    <EditDivider />
</Dialog>


<Dialog bind:open={dialogs.addItem}>
    <AddItemDialog />
</Dialog>

<!-- ----------------------------------------------------------------------- -->
