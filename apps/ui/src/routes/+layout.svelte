<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import '../app.pcss';
    import { ModeWatcher } from 'mode-watcher'
    import * as Toolbar from '$lib/components/custom/toolbar'
    import * as Pager from '$lib/components/custom/pager'

    interface Profile {
        id: number,
        name: string,
        pages: { id: number, name: string }[],
    }

    let profiles = $state<Profile[]>([
        {
            id: 0,
            name: "Personal Bookmarks",
            pages: [
                { id: 0, name: "Home" },
                { id: 1, name: "Finance" },
            ],
        },
        {
            id: 1,
            name: "Work",
            pages: [
                { id: 0, name: "Default" },
            ],
        },
    ]);
    let activeProfile = $state<Profile | null>(profiles[0]);
    let activePage = $state<number>(0)

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
            profiles={profiles}
            bind:activeProfile={activeProfile}
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
            pages={!!activeProfile ? activeProfile.pages : []}
            bind:activePage={activePage}
        />
    {/snippet}

    {#snippet right()}
        <Pager.Actions />
    {/snippet}
</Pager.Root>


<!-- ----------------------------------------------------------------------- -->
