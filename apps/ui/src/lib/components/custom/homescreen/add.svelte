<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { Plus } from 'radix-icons-svelte'
    import type { Control } from '$lib/types';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        control: Control,
        onClick?: (id: string) => void
    }

    let { control, onClick }: Props = $props()

    // Functions ///////////////////////////////////////////////////////////////

    function _onClick() {
        if (onClick) {
            onClick(control.id)
        }
    }
</script>

<!-- HTML ------------------------------------------------------------------ -->

<div
    class="w-full h-full flex flex-col items-center justify-center">
    <!-- Hit Box -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button
        class="
            flex flex-col justify-center items-center
            p-1 space-y-2
            cursor-pointer
            w-full
        "
        on:click={_onClick}
    >
        <!-- Icon -->
        <div class="
            w-16 h-16
            rounded-2xl overflow-hidden

            bg-zinc-50 dark:bg-zinc-800
            border-[0.5px] border-zinc-100 dark:border-zinc-900
            shadow dark:shadow-zinc-950

            flex justify-center items-center
        ">
            <div class="w-8 h-8">
                <Plus class="w-full h-full text-zinc-500 dark:text-zinc-500" />
            </div>
        </div>

        <!-- Title -->
        <div class="w-full h-fit">
            <p class="
                line-clamp-1 select-none
                text-zinc-500 dark:text-zinc-500
            ">Add Item</p>
        </div>
    </button>
</div>


<!-- ----------------------------------------------------------------------- -->
