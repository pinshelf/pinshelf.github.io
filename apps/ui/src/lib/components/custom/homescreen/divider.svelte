


<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import type { Divider } from '$lib/types';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        divider: Divider,
        onClick?: (id: string, url?: string) => void
    }

    let { divider, onClick}: Props = $props()

    // Functions ///////////////////////////////////////////////////////////////
    function _onClick() {
        if (onClick) { onClick(divider.id, undefined) }
    }

</script>

<!-- HTML ------------------------------------------------------------------ -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="h-16 w-full flex flex-col justify-end px-1 py-1"
    on:click={_onClick}
>
    {#if divider.title !== ""}
        <!-- Text -->
        <div class="px-2 pb-1">
            <p class="select-none font-bold text-zinc-500 dark:text-zinc-300">{divider.title}</p>
        </div>

        <!-- Divider Line -->
        <div
            class="
                w-full h-[2px] rounded-full bg-zinc-200 dark:bg-zinc-700
            "
        />

        <!-- Spacer -->
        <div class="w-full h-1" />
    {:else}
        <div class="h-8 border-b-[1px] border-zinc-200 dark:border-zinc-700"></div>
        <div class="h-8 border-t-[1px] border-zinc-200 dark:border-zinc-700"></div>
    {/if}
</div>

<!-- ----------------------------------------------------------------------- -->
