<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import type { IBookmark } from '$lib/backends';
    import { Archive } from 'radix-icons-svelte';
    import { createEventDispatcher } from 'svelte';
    import { mode } from 'mode-watcher';
    import {
        ACTIVE_CLASS_DARK,
        ACTIVE_CLASS_LIGHT,
    } from '$lib/components/custom/search/keyboardNavigation';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        isFirst?: boolean,
        bookmark: IBookmark,
        active  : boolean,
        onClick?: () => void,
    };
    let { isFirst, bookmark, active, onClick }: Props = $props()

    // State ///////////////////////////////////////////////////////////////////

    const activeClass = $mode === "dark" ? ACTIVE_CLASS_DARK : ACTIVE_CLASS_LIGHT
    const classExtension = $derived(active ? activeClass : '');

    ////////////////////////////////////////////////////////////////////////////

    const dispatch = createEventDispatcher();
</script>

<!-- Template -------------------------------------------------------------- -->

{#if !isFirst}
    <div class="w-full flex items-center justify-center">
        <div class="w-full border-t"></div>
    </div>
{/if}


<!-- Actual search entry -->
<a
    on:mouseenter={() => dispatch('mouseenter')}
    on:mouseleave={() => dispatch('mouseleave')}
    on:click={(event: Event) => {
        event.preventDefault()
        onClick()
    }}
    class={`
            p-1.5
            my-2
            h-24
            rounded-md
            flex
            flex-row
            items-center
            space-x-1
            ${classExtension}
        `}
    href="{bookmark.url}"
    target="_blank"
>
    <!-- Icon -->
    <div class="w-8 h-full flex flex-row items-start justify-center">
        <img
            class="w-5 h-5 rounded-sm mt-[3px]"
            src="http://icon.horse/icon/{bookmark.metadata.hostname}"
            alt="icon"
        />
    </div>

    <!-- Content -->
    <div class="w-full h-full flex flex-row">
        <!-- Title, Description, URL, Directory -->
        <div class="w-full h-full flex flex-col justify-between">
            <!-- Details -->
            <div>
                <p class="text-[13px] font-bold line-clamp-1 select-none">{bookmark.title}</p>
                <p class="text-[12px] font-normal line-clamp-1 text-zinc-600 dark:text-zinc-300 select-none">{bookmark.description}</p>
                <p class="text-[12px] font-mono line-clamp-1 text-zinc-500 dark:text-zinc-400 select-none">{bookmark.metadata.hostname}</p>
            </div>

            <!-- Path/Directory -->
            <div class="h-fit flex flex-row items-start space-x-1.5">
                <Archive class="text-zinc-500 dark:text-zinc-400" />
                <p class="text-[12px] font-mono line-clamp-1 text-zinc-500 dark:text-zinc-400 select-none">
                    {bookmark.metadata.path.join(' / ') || '/'}
                </p>
            </div>
        </div>

        <!-- Tags -->
        {#if bookmark.tags.length > 0}
            <div class="w-64 h-full flex flex-wrap flex-row-reverse overflow-hidden">
                {#each bookmark.tags.sort((a, b) => a.length - b.length) as tag}
                    <div class="
                        mx-[2px] my-[2.3px]
                        h-4 px-2
                        bg-zinc-200 dark:bg-zinc-700 rounded-full
                        border-[0.5px] border-zinc-300 dark:border-zinc-600 shadow-sm
                    ">
                        <span class="text-[11px] line-clamp-1 text-zinc-500 dark:text-zinc-400">{tag}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</a>

<!-- ----------------------------------------------------------------------- -->
