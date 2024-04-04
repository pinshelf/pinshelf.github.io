<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { Badge } from '$lib/components/ui/badge'

    type Props = {
        pages: { id: number, name: string }[],
        activePage: number,
    }
    let { pages, activePage = $bindable() }: Props = $props();

</script>

<!-- HTML ------------------------------------------------------------------ -->

{#each pages as page, index}
    {#if index === activePage}
        <Badge
            variant="default"
            class="cursor-pointer"
            onclick={() => activePage = page.id}
        >{page.name}</Badge>
    {:else}
        <Badge
            variant="secondary"
            class="cursor-pointer"
            onclick={() => activePage = page.id}
        >{page.name}</Badge>
    {/if}
    
{/each}


<!-- ----------------------------------------------------------------------- -->
