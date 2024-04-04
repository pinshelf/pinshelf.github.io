<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import '../app.pcss';
    import { ModeWatcher } from 'mode-watcher'
    import * as Toolbar from '$lib/components/custom/toolbar'
    import { Button } from '$lib/components/ui/button';
    import { Gear, Pencil2 } from 'radix-icons-svelte'
    import { ModeToggle } from '$lib/components/custom/mode-toggle';

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
        <!-- Edit homescreen button -->
        {#if !!activeProfile}
            <Button variant="outline" size="icon" class="hidden md:flex">
                <Pencil2/>
            </Button>

            <Button variant="outline" size="icon" class="hidden md:flex">
                <Gear/>
            </Button>
        {/if}

        <!-- Theme toggle -->
        <ModeToggle class="hidden md:block" />
    {/snippet}
</Toolbar.Root>

<!-- Content -->
<slot/>

<!-- Pager -->


<!-- ----------------------------------------------------------------------- -->
