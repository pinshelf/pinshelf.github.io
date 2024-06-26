<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { Add, App as AppComponent, Divider as DividerComponent } from '$lib/components/custom/homescreen'
    import { type Divider, type App, type Control, type AppDividerControl } from '$lib/types'
    import { homescreen } from '$lib/state/data'
    import { flip } from 'svelte/animate'
    import { Button } from '$lib/components/ui/button';
    import { ChevronLeft, ChevronRight, Trash, Pencil1 } from 'radix-icons-svelte'
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { dialogs } from '$lib/state/aux'

    // State ///////////////////////////////////////////////////////////////////

    // Effects /////////////////////////////////////////////////////////////////

    // Always unset selected when edit mode changes state
    $effect(() => {
        homescreen.editMode;
        homescreen.selectedForEdit = undefined;
    })

    // Functions ///////////////////////////////////////////////////////////////
    function onClick(id: string, url?: string) {
        if (homescreen.editMode) {
            if (homescreen.selectedForEdit === id) {
                homescreen.selectedForEdit = undefined
            }
            else {
                homescreen.selectedForEdit = id
            }

        } else if (url) {
            window.open(url, '_blank')
        }
    }

    function moveSelected(direction: 'left' | 'right') {
        if (homescreen.selectedForEdit) {
            homescreen.moveApp(homescreen.selectedForEdit, direction)
        }
    }

    function gridItemStyle(gridItem: AppDividerControl) {
        let twcss = 'w-full rounded-md '

        if (gridItem.type === 'app') {
            if (gridItem.id === homescreen.selectedForEdit) {
                twcss += 'bg-zinc-200/50 dark:bg-zinc-800/70 '
            }
        }

        else if (gridItem.type === 'divider') {
            twcss += 'col-span-4 sm:col-span-8 '

            if (gridItem.id === homescreen.selectedForEdit) {
                twcss += 'bg-zinc-200/50 dark:bg-zinc-800/70 '
            }
        }

        else if (gridItem.type === 'control') {}

        return twcss.trim()
    }

    function onEdit() {
        // Get selected item
        let item: App | Divider | undefined;
        for (const x of homescreen.currentPage.grid) {
            if (x.type === 'control') { continue }
            if (x.id !== homescreen.selectedForEdit) { continue }

            item = x;
            break;
        }

        if (!item) { return }

        if (item.type === 'app') {
            dialogs.active = 'editApp'
        }
        else if (item.type === 'divider') {
            dialogs.active = 'editDivider'
        }
    }

    function onAdd(id: string | undefined) {
        // Set control id
        homescreen.controlId = id

        // Open dialog
        dialogs.active = 'addItem'
    }

    function onDelete() {
        homescreen.removeItem()
    }

</script>

<!-- HTML ------------------------------------------------------------------ -->

<!-- Edit Bar -->
{#if homescreen.editMode}
<div
    class="
        bg-white dark:bg-zinc-900
        w-full h-12 p-2 mt-4 mb-10

        flex flex-row justify-between items-center

        rounded-md
        border-[0.5px] border-zinc-100 dark:border-zinc-700/50
        shadow dark:shadow-[0_0.5px_2px_1px_rgba(63,63,70,0.1)]
    "
>

    <!-- Left -->
    <div class="px-2">
        {#if homescreen.selectedForEdit}
            <p class="text-zinc-500 dark:text-zinc-200 line-clamp-1">
                Modify selected Item
            </p>

        {:else}
            <p class="text-zinc-600 dark:text-zinc-100 line-clamp-1">
                Select Item
            </p>
        {/if}
    </div>

    <!-- Right -->
    <div class="flex flex-row space-x-3 items-center">
        <!-- Move Left -->
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    disabled={!homescreen.selectedForEdit}
                    builders={[builder]}
                    variant="ghost"
                    size="icon"
                    on:click={() => moveSelected('left')}
                >
                    <ChevronLeft />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Move Item left</p>
            </Tooltip.Content>
        </Tooltip.Root>

        <!-- Move Right -->
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    disabled={!homescreen.selectedForEdit}
                    builders={[builder]}
                    variant="ghost"
                    size="icon"
                    on:click={() => moveSelected('right')}
                >
                    <ChevronRight />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Move Item right</p>
            </Tooltip.Content>
        </Tooltip.Root>

        <!-- Separator -->
        <div class="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>

        <!-- Edit -->
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    disabled={!homescreen.selectedForEdit}
                    builders={[builder]}
                    variant="ghost"
                    size="icon"
                    on:click={onEdit}
                >
                    <Pencil1 />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Edit item</p>
            </Tooltip.Content>
        </Tooltip.Root>

        <!-- Separator -->
        <div class="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>

        <!-- Delete -->
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    disabled={!homescreen.selectedForEdit}
                    builders={[builder]}
                    variant="destructive"
                    size="icon"
                    on:click={onDelete}
                >
                    <Trash />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Delete Item</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </div>
</div>
{/if}

<div class="w-full grid grid-cols-4 sm:grid-cols-8 gap-2 justify-items-center mt-4">
    {#each homescreen.currentPage.grid as gridItem (gridItem)}
        <div
            animate:flip={{ delay: 0, duration: 500 }}
            class={gridItemStyle(gridItem)}
        >
            {#if gridItem.type === 'app'}
                {@const app = gridItem as App}

                <AppComponent
                    {app}
                    onClick={(id, url) => onClick(id, url)}
                />

            {:else if gridItem.type === 'divider'}
                {@const divider = gridItem as Divider}

                <DividerComponent
                    {divider}
                    onClick={(id, _) => onClick(id)}
                />

            {:else if gridItem.type === 'control'}
                {@const control = gridItem as unknown as Control}
                <Add {control} onClick={onAdd}/>
            {/if}
        </div>
    {/each}
</div>



<!-- ----------------------------------------------------------------------- -->
