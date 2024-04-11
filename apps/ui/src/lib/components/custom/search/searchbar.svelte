<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { Input } from '$lib/components/ui/input';
    import { fade } from 'svelte/transition'
    import ResultsSection from './results-section.svelte';
    import WebsearchSection from './websearch-section.svelte';
    import SearchResult from './search-result.svelte';
    import Websearch from './websearch.svelte';
    import Fuse from 'fuse.js';

    // Stores //////////////////////////////////////////////////////////////////
    import { bookmarks } from '$lib/state/data'

    // State ///////////////////////////////////////////////////////////////////
    let input = $state<string>('')
    let isEmpty = $derived(input.length === 0)
    let autofocus = $state<boolean>(false)

    let corners = $derived(isEmpty ? '' : 'md:!rounded-b-none')
    let shadow = $derived(isEmpty ? '': 'md:shadow md:dark:shadow-[0_0.5px_1px_1px_rgba(63,63,70,0.3)]')

    // let bookmarks = $state<IBookmark[]>([])
    let fuse = $derived(new Fuse(bookmarks.all, {
        keys: ['title', 'description', 'metadata.hostname', 'tags']
    }))
    let searchResults = $derived(
        fuse.search(input).slice(0, 4).map(x => x.item)
    )

    // Mount ///////////////////////////////////////////////////////////////////
    $effect(() => { bookmarks.load() })

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
                <!-- Dummy -->
                <!-- <div class="
                    w-full
                    h-[200px]
                    flex items-center justify-center
                ">
                    <p>DUMMY</p>
                </div> -->

                <ResultsSection>
                    {#each searchResults as searchResult, index}
                        {#if index === 0}
                            <SearchResult
                                isFirst={true}
                                bookmark={searchResult}
                            />
                        {:else}
                            <SearchResult
                                isFirst={false}
                                bookmark={searchResult}
                            />
                        {/if}
                    {/each}

                    <!-- <SearchResult
                        isFirst={true}
                        bookmark={{
                            id: 0,
                            title: "GitHub",
                            description: "Online Code Repositories",
                            note: "",
                            url: "https://github.com",
                            tags: ["dev", "git", "code", "asdfsdf", "asd", "asdfsf", "asdf", "asd", "sa", "asdfaeadsf", "as;ldkfjsadklfj"],
                            metadata: {
                                path: ["dev", "general"],
                                hostname: "github.com",
                            },
                        }}
                    />
                    <SearchResult
                        isFirst={false}
                        bookmark={{
                            id: 1,
                            title: "GitHub",
                            description: "Online Code Repositories",
                            note: "",
                            url: "https://github.com",
                            tags: ["dev", "git", "code"],
                            metadata: {
                                path: ["dev", "general"],
                                hostname: "github.com",
                            },
                        }}
                    />
                    <SearchResult
                        isFirst={false}
                        bookmark={{
                            id: 2,
                            title: "GitHub",
                            description: "Online Code Repositories",
                            note: "",
                            url: "https://github.com",
                            tags: [],
                            metadata: {
                                path: ["dev", "general"],
                                hostname: "github.com",
                            },
                        }}
                    /> -->
                </ResultsSection>
                <WebsearchSection>
                    <Websearch search={input} />
                </WebsearchSection>

            </div>
        </div>
    {/if}
</div>

<!-- ----------------------------------------------------------------------- -->
