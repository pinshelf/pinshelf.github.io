<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { Input } from '$lib/components/ui/input';
    import { fade } from 'svelte/transition'

    // State ///////////////////////////////////////////////////////////////////
    let input = $state<string>('asdf')
    let isEmpty = $derived(input.length === 0)
    let autofocus = $state<boolean>(false)

    let corners = $derived(isEmpty ? '' : 'md:!rounded-b-none')
    let shadow = $derived(isEmpty ? '': 'md:shadow md:dark:shadow-[0_0.5px_1px_1px_rgba(63,63,70,0.3)]')

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- Template -------------------------------------------------------------- -->
<div
    class="
        w-full
        h-fit
        mb-1.5 mt-0 sm:mb-0 sm:mt-1.5
        absolute
        bottom-0 sm:bottom-auto

        flex flex-col-reverse sm:flex-col
    "
>
    <Input
        class={`
            h-9
            shadow-none
            !ring-inset !ring-0 !ring-zinc-200 dark:!ring-zinc-600
            ${corners}
            ${shadow}

            transition-shadow
        `}
        placeholder="Search"
        spellcheck={false}
        autofocus={autofocus}
        bind:value={input}
    />

    {#if !isEmpty}
        <!-- Search result wrapper (takes care of positioning and padding) -->
        <div
            transition:fade={{ duration: 200 }}
            class="
                w-full
                h-fit

                fixed left-0 bottom-20
                sm:bottom-auto sm:top-16
                md:static

                p-3 sm:p-2 md:p-0
            "
        >
            <!-- Actual container  -->
            <div
                class="
                    bg-white dark:bg-zinc-900

                    rounded-md md:rounded-t-none
                    border-[0.5px]
                    border-zinc-200 dark:border-zinc-700/50
                    shadow dark:shadow-[0_0.5px_1px_1px_rgba(63,63,70,0.3)]
                "
            >
                <div class="
                    w-full
                    h-[200px]
                    flex items-center justify-center
                ">
                    <p>DUMMY</p>
                </div>
            </div>
        </div>
    {/if}
</div>

<!-- ----------------------------------------------------------------------- -->
