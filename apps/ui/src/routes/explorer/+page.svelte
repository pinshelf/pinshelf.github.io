<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { onMount } from 'svelte';
    import { cn } from '$lib/utils';
    import { Badge } from '$lib/components/ui/badge';
    import { ScrollArea } from '$lib/components/ui/scroll-area';
    import { formatDistanceToNow } from 'date-fns';
    import { de } from 'date-fns/locale';
    import backend from '$lib/state/backend.svelte';
    import type { IBookmark } from '$lib/backends';

    let items: IBookmark[] = [];

    function getBadgeVariant(category: string): 'default' | 'outline' | 'secondary' | 'destructive' | undefined {
        if (['work'].includes(category.toLowerCase())) {
            return 'default';
        }

        if (['personal'].includes(category.toLowerCase())) {
            return 'outline';
        }

        return 'secondary';
    }

    function openLink(url: string) {
        window.open(url, '_blank');
    }

    onMount(async () => {
        const backendData = backend.data;
        if (backendData.some) {
            const result = await backendData.val.get();
            if (result.ok) {
                items = result.val;
            } else {
                console.error('Fehler beim Laden der Lesezeichen:', result.val);
            }
        } else {
            console.error('Kein Backend verfügbar');
        }
    });

    let selectedItem: number | null = null;
</script>

<!-- HTML ------------------------------------------------------------------ -->
<ScrollArea class="h-[calc(100vh-4rem)]">
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
                                selectedItem === item.id
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            {formatDistanceToNow(new Date(), { addSuffix: true, locale: de })}
                        </div>
                    </div>
                    <div class="text-xs font-medium">{item.description}</div>
                </div>
                <div class="flex items-center gap-2">
                    {#each item.tags as tag}
                        <Badge variant={getBadgeVariant(tag)}>
                            {tag}
                        </Badge>
                    {/each}
                </div>
            </button>
        {/each}
    </div>
</ScrollArea>
