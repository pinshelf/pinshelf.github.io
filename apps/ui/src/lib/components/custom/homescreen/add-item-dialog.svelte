<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as Tabs from '$lib/components/ui/tabs';
    import Input from '$lib/components/ui/input/input.svelte';
    import Label from '$lib/components/ui/label/label.svelte';
    import { SearchResult } from '$lib/components/custom/search'

    import { type IBookmark } from '$lib/backends';
    import { slide } from 'svelte/transition'
    import { getIconUrl } from 'url-icons';
    import Fuse from 'fuse.js';

    // Stores //////////////////////////////////////////////////////////////////
    import { dialogs } from '$lib/state/aux';
    import { bookmarks, homescreen } from '$lib/state/data';

    // Props ///////////////////////////////////////////////////////////////////

    // State ///////////////////////////////////////////////////////////////////

    // Divider data
    let divider = $state<{ title: string }>({ title: '' });

    // Inputs
    let search = $state<string>()
    let titleOverwrite = $state<string>()
    let iconUrlOverwrite = $state<string>()

    // Selected bookmark
    let bookmark = $state<IBookmark | undefined>()

    // UI
    let tab = $state<'app' | 'divider'>('app');
    let addBtnDisabled = $derived(tab === 'app' && !bookmark)
    let fuse = $derived(new Fuse(bookmarks.all, {
        keys: ['title', 'description', 'metadata.hostname', 'tags']
    }))
    let searchResults = $derived(
        fuse.search(search || '').slice(0, 20).map(x => x.item)
    )

    let defaultIconInfo = $derived(bookmark ? getIconUrl(bookmark.url) : undefined)

    // Effects /////////////////////////////////////////////////////////////////

    // Functions ///////////////////////////////////////////////////////////////
    function onAdd() {
        // Add divider
        if (tab === 'divider') {
            homescreen.addDivider(divider.title);
        }

        // Add tab
        else if (tab === 'app' && bookmark) {
            // Build app data
            homescreen.addApp({
                bookmarkId: bookmark.id,
                overwrites: {
                    title: titleOverwrite,
                    iconUrl: iconUrlOverwrite,
                }
            })
        }

        dialogs.addItem = false;
    }


    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->
<Card.Root class="h-fit max-h-full flex flex-col">
    <Card.Header>
        <Card.Title>Add {tab === 'app' ? 'App' : 'Divider'}</Card.Title>
        <Card.Description>
            Add a new {tab === 'app' ? 'App' : 'Divider'}
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll flex flex-col space-y-6">
        <!-- Tabs -->
        <Tabs.Root bind:value={tab} class="">
            <Tabs.List class="w-full">
                <Tabs.Trigger value="app" class="w-full">App</Tabs.Trigger>
                <Tabs.Trigger value="divider" class="w-full"
                    >Divider</Tabs.Trigger
                >
            </Tabs.List>

            <!-- App -->
            <div class="w-full h-[530px] pt-4">
                {#if tab === 'app'}
                    <Tabs.Content value="app" class="w-full h-full flex flex-col space-y-6">
                        <!-- Search and selection -->
                        <div>
                            <!-- Search -->
                            <Label for="bm-search">
                                Select a Bookmark
                            </Label>
                            <Input
                                id="bm-search"
                                class={(() => {
                                    let base = "mt-1 "
                                    if (search) {
                                        base += 'rounded-b-none '
                                    }

                                    return base
                                })()}
                                bind:value={search}
                                placeholder="Search Bookmarks"
                            />

                            <!-- Search results -->
                            {#if search}
                                <div transition:slide class="w-full h-72 ring-1 ring-zinc-300 rounded-b-md">
                                <div
                                    class="p-3 h-full overflow-auto"
                                >
                                    {#each searchResults as bm, i}
                                        <!-- Bookmark -->
                                        <div>
                                            {#if i === 0}
                                                <SearchResult
                                                    active={false}
                                                    isFirst={true}
                                                    bookmark={bm}
                                                    onClick={() => {
                                                        bookmark = bm
                                                        search = undefined
                                                    }}
                                                />
                                            {:else}
                                                <SearchResult
                                                    active={false}
                                                    isFirst={false}
                                                    bookmark={bm}
                                                    onClick={() => {
                                                        bookmark = bm
                                                        search = undefined
                                                    }}
                                                />
                                            {/if}
                                        </div>
                                    {/each}
                                </div>
                                </div>
                            {/if}
                        </div>

                        <!-- Bookmark visualization -->
                        <div>
                            <!-- Title -->
                            <Label for="bm-title">
                                Bookmark Title
                            </Label>
                            <Input
                                id="bm-title"
                                disabled
                                value={bookmark?.title}
                                placeholder="Select a bookmark first!"
                                class="mt-1 mb-3"
                            />

                            <!-- URL -->
                            <Label for="bm-url">
                                Bookmark URL
                            </Label>
                            <Input
                                id="bm-url"
                                disabled
                                value={bookmark?.url}
                                placeholder="Select a bookmark first!"
                                class="mt-1"
                            />
                        </div>

                        <!-- Overwrites -->
                        <div>
                            <!-- Divider -->
                            <div class="flex flex-col pt-3 space-y-3 mb-2">
                                <div class="border-b-[1px] dark:border-zinc-800"/>
                                <p class="font-bold text-md">Overwrites</p>
                            </div>

                            <Label for="title">Title</Label>
                            <Input
                                id="title"
                                bind:value={titleOverwrite}
                                placeholder={bookmark ? bookmark.title : ''}
                                class="mt-1 mb-3"
                            />

                            <!-- Icon URL -->
                            <Label for="iconUrl">Icon URL</Label>
                            <Input
                                id="iconUrl"
                                bind:value={iconUrlOverwrite} class="!mt-2"
                                placeholder={defaultIconInfo?.url}
                            />

                            <!-- Render Default Icon Attribution -->
                            {#if defaultIconInfo}
                                <p class="text-sm my-2">
                                Default app image published <a class="underline" href={defaultIconInfo.attribution.source} target="_blank">here</a>

                                {#if defaultIconInfo.attribution.license}
                                    (under <a class="underline" href={defaultIconInfo.attribution.license.link} target="_blank">{defaultIconInfo.attribution.license.name}</a> license)
                                {/if}

                                {#if defaultIconInfo.attribution.author}
                                    created by <span>{defaultIconInfo.attribution.author}</span>
                                {/if}
                                .
                                </p>
                            {/if}
                        </div>
                    </Tabs.Content>

                    <!-- Divider -->
                {:else if tab === 'divider'}
                    <Tabs.Content value="divider" class="w-full h-full">
                        <Label for="divider-title">Title</Label>
                        <Input
                            class="mt-1"
                            id="divider-title"
                            bind:value={divider.title}
                            placeholder="Enter a title for the divider"
                        />
                    </Tabs.Content>
                {/if}
            </div>
        </Tabs.Root>
    </Card.Content>

    <Card.Footer class="flex flex-row justify-between pt-4 pr-7">
        <Button variant="secondary" onclick={() => (dialogs.addItem = false)}
            >Close</Button
        >
        <Button
            disabled={addBtnDisabled}
            on:click={onAdd}
        >
            Add
        </Button>
    </Card.Footer>
</Card.Root>

<!-- ----------------------------------------------------------------------- -->
