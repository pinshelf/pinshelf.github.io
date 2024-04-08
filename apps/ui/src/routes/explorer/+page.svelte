<script lang="ts">
    import { cn } from "$lib/utils";
    import { ScrollArea } from "$lib/components/ui/scroll-area";
    import { formatDistanceToNow } from "date-fns";
    import { de } from "date-fns/locale";
    import backend from '$lib/state/backend.svelte';
    import type { IBookmark } from '$lib/backends';
    import { Button } from "$lib/components/ui/button";


    let items = $state<IBookmark[]>([]);
    let tags = $state<string[]>([]);
    let selectedItem = $state<number | null>(null);
    let isCollapsed = $state<boolean>(false);

    function openLink(url: string) {
        window.open(url, '_blank');
    }

    function handleTagClick(event: MouseEvent, tag: string) {
        event.stopPropagation();
        alert(`Du hast auf das Tag "${tag}" geklickt!`);
    }

    // onMount(async () => {
    //     const backendData = backend.data;
    //     if (backendData.some) {
    //         const result = await backendData.val.get();
    //         if (result.ok) {
    //             items = result.val;
    //             tags = [...new Set(items.flatMap(item => item.tags))];
    //         } else {
    //             console.error('Fehler beim Laden der Lesezeichen:', result.val);
    //         }
    //     } else {
    //         console.error('Kein Backend verfügbar');
    //     }
    // });

    $effect(() => {
        const backendData = backend.data;
        if (backendData.some) {
            backendData.val.get().then((result) => {
                if (result.ok) {
                    items = result.val;
                    tags = [...new Set(items.flatMap(item => item.tags))]
                } else {
                    console.error(
                        'Fehler beim Laden der Lesezeichen:',
                        result.val
                    );
                }
            })
        } else {
            console.error('Kein Backend verfügbar');
        }
    })


</script>

<div class="flex">
    <!-- Content -->
    <ScrollArea class="h-[calc(100vh-4rem)] flex-1">
        <div class="flex flex-col gap-2 p-4 pt-0">
            {#each items as item}
                <button
                    class={cn(
                        "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                        selectedItem === item.id && "bg-muted"
                    )}
                    on:click={() => openLink(item.url)}
                >
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
                    <div class="flex items-center gap-2">
                        {#each item.tags as tag}
                            <Button
                                variant="outline"
                                class="cursor-pointer justify-start"
                                on:click={(event) => handleTagClick(event, tag)}
                            >
                                {tag}
                            </Button>
                        {/each}
                    </div>
                </button>
            {/each}
        </div>
    </ScrollArea>
</div>
