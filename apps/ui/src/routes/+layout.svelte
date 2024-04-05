<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import '../app.pcss';
    import { ModeWatcher } from 'mode-watcher'
    import * as Toolbar from '$lib/components/custom/toolbar'
    import * as Pager from '$lib/components/custom/pager'
    import { fade } from 'svelte/transition'

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

    let manageProfilesDialogOpen = $state(false)
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
            pages={!!activeProfile ? activeProfile.pages : []}
            bind:activePage={activePage}
        />
    {/snippet}

    {#snippet right()}
        <Pager.Actions />
    {/snippet}
</Pager.Root>

<!-- Dialogs -->
{#if manageProfilesDialogOpen === true}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    transition:fade={{ duration: 200 }}

    class="
        bg-zinc-500/40 dark:bg-zinc-950/40 backdrop-blur-sm
        w-full h-dvh
        fixed left-0 top-0 z-50
        flex flex-col items-center justify-around
        p-4
    "

    onclick={() => manageProfilesDialogOpen = false}
>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="
            bg-indigo-800
            w-full max-w-[640px]
            h-auto
        "

        onclick={(e) => e.stopPropagation()}
    >
        <!--  -->
    </div>
</div>
{/if}


<!-- ----------------------------------------------------------------------- -->
