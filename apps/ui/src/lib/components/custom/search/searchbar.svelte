<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import type { IBookmark } from '$lib/backends';
    import { Input } from '$lib/components/ui/input';
    import { fade } from 'svelte/transition';
    import ResultsSection from './results-section.svelte';
    import WebsearchSection from './websearch-section.svelte';
    import SearchResult from './search-result.svelte';
    import Websearch from './websearch.svelte';
    import Fuse from 'fuse.js';
    import {
        evaluateNavigationKey, focusSearchInput, isInputKey,
        isNavigationKey,
        SEARCH_INPUT_ID,
    } from '$lib/components/custom/search/keyboardNavigation';
    import { isDesktop } from '$lib/utils/plattformDetection';

    // Stores //////////////////////////////////////////////////////////////////
    import { bookmarks } from '$lib/state/data'

    // State ///////////////////////////////////////////////////////////////////
    let input = $state<string>('');
    let isEmpty = $derived(input.length === 0);

    let corners = $derived(isEmpty ? '' : 'md:!rounded-b-none');
    let shadow = $derived(isEmpty ? '' : 'md:shadow md:dark:shadow-[0_0.5px_1px_1px_rgba(63,63,70,0.3)]');

    // Mount ///////////////////////////////////////////////////////////////////

    // let bookmarks = $state<IBookmark[]>([]);
    let fuse = $derived(new Fuse(bookmarks.all, {
        keys: ['title', 'description', 'metadata.hostname', 'tags'],
    }));
    let searchResults = $derived<IBookmark[]>(
        fuse.search(input).slice(0, 4).map(x => x.item),
    );
    const searchUrl = $derived(`https://duckduckgo.org?q=${encodeURI(input)}`);

    let activeIndex = $state<number>(-1);
    let inputIsFocused = $state<boolean>(false);

    // Mount ///////////////////////////////////////////////////////////////////
    $effect(() => { bookmarks.load() })


    ////////////////////////////////////////////////////////////////////////////
    function onKeyDown(event: KeyboardEvent) {
        // if (isInputKey(event.key) && !inputIsFocused) {
        //     focusSearchInput()
        // }

        if (inputIsFocused && input.length > 0 && isNavigationKey(event.key)) {
            event.preventDefault();
            evaluateNavigationKey(event.key, activeIndex, searchResults.length, {
                handleDown: () => activeIndex++,
                handleUp: () => activeIndex--,
                handleEnter: () => {
                    const url = activeIndex < searchResults.length ? searchResults[activeIndex].url : searchUrl;
                    window.open(url, '_blank');
                    input = '';
                },
                handleEscape: () => {
                    input = '';
                },
            });
        }
    }
</script>

<svelte:body on:keydown={onKeyDown}></svelte:body>

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
        id={SEARCH_INPUT_ID}
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
        autofocus={isDesktop()}
        bind:value={input}
        on:focusout={() => inputIsFocused = false}
        on:focus={() => inputIsFocused = true}
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
            <div
                class="
                    bg-white dark:bg-zinc-900
                    rounded-md md:rounded-t-none
                    border-[0.5px]
                    border-zinc-200 dark:border-zinc-700/50
                    shadow dark:shadow-[0_0.5px_1px_1px_rgba(63,63,70,0.3)]
                "
            >
                <ResultsSection>
                    {#each searchResults as searchResult, index}
                        <SearchResult
                            isFirst={index === 0}
                            active={activeIndex === index}
                            bookmark={searchResult}
                            on:mouseenter={() => activeIndex = index}
                            on:mouseleave={() => activeIndex = -1}
                        />
                    {/each}
                </ResultsSection>
                <WebsearchSection>
                    <Websearch
                        searchString={input}
                        searchUrl={searchUrl}
                        active={activeIndex === searchResults.length}
                        on:mouseenter={() => activeIndex = searchResults.length}
                        on:mouseleave={() => activeIndex = -1}
                    />
                </WebsearchSection>
            </div>
        </div>
    {/if}
</div>

<!-- ----------------------------------------------------------------------- -->
