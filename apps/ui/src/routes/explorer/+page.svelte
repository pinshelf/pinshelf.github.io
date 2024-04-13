<script lang="ts">
    import { onMount } from 'svelte';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import type { IBookmark } from '$lib/utils/db';
    import { bookmarksStore, loadData, updateBookmark } from '$lib/utils/dataService';
    import { addNewTag, deleteTag, updateTag } from '$lib/utils/tagUtils';
    import { HfInference } from '@huggingface/inference';
    import { SettingsDialog } from '$lib/components/custom/settings-dialog';
    import { bookmarks as globalBookmarks } from '$lib/state/data'

    let API_TOKEN = "";

    onMount(() => {
        const storedToken = localStorage.getItem("huggingFaceToken");
        if (storedToken) {
            API_TOKEN = storedToken;
        }
    });

    let bookmarks = $state<IBookmark[]>([])
    $effect(() => { bookmarks = globalBookmarks.all })

    let tags = $state<string[]>([]);
    let selectedBookmark = $state<number | null>(null);
    let recommendedBookmark = $state<IBookmark | null>(null);

    function selectRandomBookmarkWithTopTag() {
        const tagCounts = bookmarks.reduce((acc: Record<string, number>, bookmark) => {
            bookmark.tags.forEach(tag => {
                acc[tag] = (acc[tag] || 0) + 1;
            });
            return acc;
        }, {});

        const topTag = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0])[0];

        if (!topTag) {
            return null; // Keine Tags vorhanden
        }

        const bookmarksWithTopTag = bookmarks.filter(bookmark => bookmark.tags.includes(topTag));

        if (bookmarksWithTopTag.length === 0) {
            return null; // Keine Bookmarks mit dem Top-Tag vorhanden
        }

        const randomIndex = Math.floor(Math.random() * bookmarksWithTopTag.length);
        return bookmarksWithTopTag[randomIndex];
    }

    async function generateAITags(event: MouseEvent, bookmark: IBookmark) {
        event.stopPropagation();

        try {
            const hf = new HfInference(API_TOKEN);

            const result = await hf.textGeneration({
                model: "google/gemma-1.1-7b-it",
                inputs: `<s>[INST] Generate 10 single-word categories for the bookmark "${bookmark.title}". NOTHING ELSE! [/INST]`,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    top_p: 0.9
                }
            });

            const generatedText = result.generated_text;
            console.error(`Generated AI Tags for "${bookmark.title}":\n${generatedText}`);

            const generatedTags = generatedText
                .split('\n')
                .map((line: string) => line.trim())
                .filter((line: string) => /^(\d+\.|-)/.test(line))
                .map((line: string) => line.replace(/^(\d+\.|-)\s*/, '').trim());

            const newTags = generatedTags.filter((tag: any) =>
                !bookmark.tags.some(existingTag => existingTag.toLowerCase() === tag.toLowerCase())
            );

            const updatedBookmark = {
                ...bookmark,
                tags: [...new Set([...bookmark.tags, ...newTags])].sort((a, b) =>
                    a.toLowerCase().localeCompare(b.toLowerCase())
                )
            };

            await updateBookmarksAndTags(updatedBookmark);

            console.log(`Generated AI Tags for "${bookmark.title}":\n\n${newTags.join(', ')}`);
        } catch (error) {
            console.error("Error during tag generation:", error);
            console.log("An error occurred during tag generation. Please check the console for more details.");
        }
    }

    function openLink(url: string) {
        window.open(url, '_blank');
    }

    function handleTagClick(event: MouseEvent, bookmark: IBookmark, index: number) {
        event.stopPropagation();
        const input = event.target as HTMLInputElement;
        input.focus();
        input.select();
    }

    async function updateBookmarksAndTags(updatedBookmark: IBookmark | null) {
        if (updatedBookmark && updatedBookmark.id !== undefined) {
            await updateBookmark(updatedBookmark.id, updatedBookmark);
            bookmarks = bookmarks.map(b => b.id === updatedBookmark.id ? updatedBookmark : b);
            tags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags))];
        }
    }

    async function handleAddNewTag(bookmark: IBookmark) {
        const updatedBookmark = await addNewTag(bookmark);
        await updateBookmarksAndTags(updatedBookmark);
    }

    async function handleDeleteTag(bookmark: IBookmark, index: number) {
        const updatedBookmark = await deleteTag(bookmark, index);
        await updateBookmarksAndTags(updatedBookmark);
    }

    async function handleTagKeyDown(event: KeyboardEvent, bookmark: IBookmark, index: number) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newTag = bookmark.tags[index].trim();
            let updatedBookmark: IBookmark | null = null;

            if (newTag !== '') {
                updatedBookmark = await updateTag(bookmark, index, newTag);
            } else {
                updatedBookmark = await deleteTag(bookmark, index);
            }

            await updateBookmarksAndTags(updatedBookmark);
            (event.target as HTMLInputElement).blur();
        }
    }

    $effect(() => {
        loadData().then(() => {
            bookmarks = $bookmarksStore;
            tags = [...new Set(bookmarks.flatMap(bookmark => bookmark.tags))];
            recommendedBookmark = selectRandomBookmarkWithTopTag(); // Empfohlenes Bookmark setzen
        });
    });
</script>

<div class="flex flex-col gap-2 p-4 pt-0">
    <h2 class="mb-2 font-bold">Meine Bookmarks</h2>

    <ScrollArea class="h-[calc(100vh-4rem)] flex-1">
        {#if recommendedBookmark}
            <div class="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
                <div class="flex w-full justify-between items-center">
                    <h2 class="font-bold">Empfohlen</h2>
                    <SettingsDialog />
                </div>
                <button class="w-full text-left" on:click={() => openLink(recommendedBookmark!.url)}>
                    <div class="flex w-full flex-col gap-1">
                        <div class="flex items-center">
                            <img 
                                src={`https://www.google.com/s2/favicons?domain=${recommendedBookmark.url}&sz=128`} 
                                alt="Favicon" 
                                class="mr-4 h-16 w-16"
                            />
                            <div class="font-semibold">{recommendedBookmark.title}</div>
                        </div>
                        <div class="text-xs font-medium">{recommendedBookmark.description}</div>
                    </div>
                </button>
                <div class="flex flex-wrap gap-2">
                    {#each recommendedBookmark.tags as tag}
                        <div class="rounded-lg border px-2 py-1 text-sm">{tag}</div>
                    {/each}
                </div>
            </div>

            <div class="my-4 border-t"></div>
        {/if}

        {#each bookmarks as bookmark}
            <div class="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent">
                <button class="w-full text-left" on:click={() => openLink(bookmark.url)}>
                    <div class="flex w-full flex-col gap-1">
                        <div class="flex items-center">
                            <img 
                                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=128`} 
                                alt="Favicon" 
                                class="mr-4 h-16 w-16"
                            />
                            <div class="font-semibold">{bookmark.title}</div>
                        </div>
                        <div class="text-xs font-medium">{bookmark.description}</div>
                    </div>
                </button>
                <div class="flex flex-wrap gap-2">
                    {#each bookmark.tags as tag, index}
                        <div class="relative group">
                            <input
                                type="text"
                                bind:value={bookmark.tags[index]}
                                data-bookmark-id={bookmark.id}
                                class="cursor-pointer justify-start rounded-lg border px-2 py-1 pr-6 text-sm"
                                on:click={(event) => handleTagClick(event, bookmark, index)}
                                on:keydown={(event) => handleTagKeyDown(event, bookmark, index)}
                            />
                            <button
                                class="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer text-sm text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                                on:click={() => handleDeleteTag(bookmark, index)}
                            >
                                &times;
                            </button>
                        </div>
                    {/each}
                    <button
                        class="cursor-pointer justify-start rounded-lg border px-2 py-1 text-sm"
                        on:click={() => handleAddNewTag(bookmark)}
                    >
                        + Neuer Tag
                    </button>
                    <button
                        class="cursor-pointer justify-start rounded-lg border px-2 py-1 text-sm"
                        on:click={(event) => generateAITags(event, bookmark)}
                    >
                        + Mit KI hinzufügen
                    </button>
                </div>
            </div>
        {/each}
    </ScrollArea>
</div>