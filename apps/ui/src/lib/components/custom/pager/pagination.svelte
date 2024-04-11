<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { Badge } from '$lib/components/ui/badge'
    import { homescreen } from '$lib/state/data'

    let cursor = $state<string>('cursor-pointer')

    $effect(() => {
        cursor = homescreen.editMode === false
            ? 'cursor-pointer'
            : 'cursor-not-allowed'
    })

</script>

<!-- HTML ------------------------------------------------------------------ -->

{#each homescreen.pages as page, index}
    {#if page.title === homescreen.currentPage.title}
        <Badge
            variant="default"
            class={cursor}
            onclick={() => {
                if (homescreen.editMode === false) {
                    homescreen.setActivePage(index)
                }
            }}
        >{page.title}</Badge>
    {:else}
        <Badge
            variant="secondary"
            class={cursor}
            onclick={() => {
                if (homescreen.editMode === false) {
                    homescreen.setActivePage(index)
                }
            }}
        >{page.title}</Badge>
    {/if}
    
{/each}


<!-- ----------------------------------------------------------------------- -->
