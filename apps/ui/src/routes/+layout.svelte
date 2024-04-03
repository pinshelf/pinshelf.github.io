<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import '../app.pcss';
    import * as Toolbar from '$lib/components/custom/toolbar';

    interface Profile {
        id: number,
        name: string,
    }

    let profiles = $state<Profile[]>([
        { id: 0, name: "Personal" },
        { id: 1, name: "Work" },
    ]);
    let activeProfile = $state<Profile | null>(null);

</script>

<!-- HTML ------------------------------------------------------------------ -->
<!-- Head -->
<svelte:head>
    <title>Pinshelf</title>
</svelte:head>

<!-- Toolbar -->
<Toolbar.Root>
    {#snippet left()}
        <Toolbar.Menu
            profiles={profiles}
            bind:activeProfile={activeProfile}
        />
    {/snippet}

    {#snippet middle()}
        b
    {/snippet}

    {#snippet right()}
        c
    {/snippet}
</Toolbar.Root>

<!-- Content -->
<slot/>

<!-- ----------------------------------------------------------------------- -->
