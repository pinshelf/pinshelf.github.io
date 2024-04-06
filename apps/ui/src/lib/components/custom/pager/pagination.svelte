<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { Badge } from '$lib/components/ui/badge'

    type Props = {
        pages: { name: string }[],
        activePage: string,
    }
    let { pages, activePage = $bindable() }: Props = $props();

</script>

<!-- HTML ------------------------------------------------------------------ -->

{#each pages as page}
    {#if page.name === activePage}
        <Badge
            variant="default"
            class="cursor-pointer"
            onclick={() => activePage = page.name}
        >{page.name}</Badge>
    {:else}
        <Badge
            variant="secondary"
            class="cursor-pointer"
            onclick={() => activePage = page.name}
        >{page.name}</Badge>
    {/if}
    
{/each}


<!-- ----------------------------------------------------------------------- -->
