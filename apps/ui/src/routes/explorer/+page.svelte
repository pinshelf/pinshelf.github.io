<script lang="ts">
    import { onMount } from 'svelte';
    import { cn } from "$lib/utils";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { formatDistanceToNow } from "date-fns";
    import { de } from "date-fns/locale";
    import backend from '$lib/state/backend.svelte';
    import type { IBookmark } from '$lib/backends';

    const TAGS_STORAGE_KEY = 'bookmarkTags';

    let items: IBookmark[] = [];
    let tags: string[] = [];
    let selectedItem: number | null = null;

    function openLink(url: string) {
        window.open(url, '_blank');
    }

    function handleTagClick(event: MouseEvent, item: IBookmark, index: number) {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        input.focus();
        input.select();
    }

    function addNewTag(item: IBookmark) {
        item.tags = [...item.tags, ''];
        items = items;
        setTimeout(() => {
            const lastInput = document.querySelector(`input[data-item-id="${item.id}"]:last-child`) as HTMLInputElement;
            if (lastInput) {
                lastInput.focus();
            }
        }, 0);
    }

    function deleteTag(item: IBookmark, index: number) {
        item.tags.splice(index, 1);
        items = items;
        saveTags();
    }

    function handleTagKeyDown(event: KeyboardEvent, item: IBookmark, index: number) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newTag = (event.target as HTMLInputElement).value.trim();
            if (newTag !== '') {
                item.tags[index] = newTag;
                items = items;
                saveTags();
            } else {
                deleteTag(item, index);
            }
            (event.target as HTMLInputElement).blur();
        }
    }

    function saveTags() {
        const tagsByBookmarkId: Record<number, string[]> = {};
        items.forEach(item => {
            tagsByBookmarkId[item.id] = item.tags;
        });
        localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tagsByBookmarkId));
    }

    function loadTags() {
        const savedTags = localStorage.getItem(TAGS_STORAGE_KEY);
        if (savedTags) {
            const tagsByBookmarkId: Record<number, string[]> = JSON.parse(savedTags);
            items.forEach(item => {
                if (tagsByBookmarkId[item.id]) {
                    item.tags = tagsByBookmarkId[item.id];
                }
            });
            tags = [...new Set(items.flatMap(item => item.tags))];
        }
    }

    async function loadData() {
        const backendData = backend.data;
        if (backendData.some) {
            const result = await backendData.val.get();
            if (result.ok) {
                items = result.val;
                loadTags();
            } else {
                console.error('Fehler beim Laden der Lesezeichen:', result.val);
            }
        } else {
            console.error('Kein Backend verfügbar');
        }
    }

    onMount(async () => {
        await loadData();
    });
</script>

<div class="flex">
    <!-- Content -->
    <ScrollArea class="h-[calc(100vh-4rem)] flex-1">
        <div class="flex flex-col gap-2 p-4 pt-0">
            {#each items as item}
                <div
                    class={cn(
                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                        selectedItem === item.id && "bg-muted"
                    )}
                >
                    <button class="w-full text-left" on:click={() => openLink(item.url)}>
                        <div class="flex w-full flex-col gap-1">
                            <div class="flex items-center">
                                <div class="font-semibold">{item.title}</div>
                                <div
                                    class={cn(
                                        "ml-auto text-xs",
                                        selectedItem === item.id ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {formatDistanceToNow(new Date(), { addSuffix: true, locale: de })}
                                </div>
                            </div>
                            <div class="text-xs font-medium">{item.description}</div>
                        </div>
                    </button>
                    <div class="flex flex-wrap gap-2">
                        {#each item.tags as tag, index}
                            <div class="relative group">
                                <input
                                    type="text"
                                    value={tag}
                                    data-item-id={item.id}
                                    class="cursor-pointer justify-start rounded-lg border px-2 py-1 pr-6 text-sm"
                                    on:click={(event) => handleTagClick(event, item, index)}
                                    on:keydown={(event) => handleTagKeyDown(event, item, index)}
                                />
                                <button
                                    class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                                    on:click={() => deleteTag(item, index)}
                                >
                                    &times;
                                </button>
                            </div>
                            {#if (index + 1) % 3 === 0}
                                <br />
                            {/if}
                        {/each}
                        <button
                            class="cursor-pointer justify-start rounded-lg border px-2 py-1 text-sm"
                            on:click={() => addNewTag(item)}
                        >
                            + New Tag
                        </button>
                    </div>
                </div>
                <div>
                    {console.log(`Tags for "${item.title}":`, item.tags)}
                </div>
            {/each}
        </div>
    </ScrollArea>
</div>