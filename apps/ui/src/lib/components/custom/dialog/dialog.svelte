<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { fade } from 'svelte/transition'

    // Props ///////////////////////////////////////////////////////////////////
    type Props = { open: boolean, children: any };

    let { open = $bindable(), children }: Props = $props();

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- Template -------------------------------------------------------------- -->
{#if open === true}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        transition:fade={{ duration: 150 }}

        class="
            bg-zinc-500/40 dark:bg-zinc-950/40 backdrop-blur-sm
            w-full h-dvh
            fixed left-0 top-0 z-50
            flex flex-col items-center justify-around
            p-4
        "

        on:click={() => open = false}
    >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
            class="w-full max-w-[640px] max-h-full "
            on:click={(e) => e.stopPropagation()}
        >
            {@render children()}
        </div>
    </div>
{/if}

<!-- ----------------------------------------------------------------------- -->
