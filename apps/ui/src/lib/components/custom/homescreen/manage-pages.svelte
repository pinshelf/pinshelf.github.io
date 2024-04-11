<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { flip } from 'svelte/animate'
    import { Input } from "$lib/components/ui/input";

    import { ChevronUp, ChevronDown, Pencil1, Trash, Plus } from 'radix-icons-svelte'

    // Stores //////////////////////////////////////////////////////////////////
    import { dialogs } from '$lib/state/aux';
    import { homescreen } from '$lib/state/data';

    // Props ///////////////////////////////////////////////////////////////////


    // State ///////////////////////////////////////////////////////////////////
    let selection       = $state<string | undefined>()
    let editMode        = $state<boolean>(false)
    let editBtnDisabled = $state<boolean>(false)
    let input           = $state<string | undefined>()
    let deleteBtnDisabled = $derived(homescreen.pages.length < 2)

    // Effects /////////////////////////////////////////////////////////////////

    // Disable edit button, if the entered page name already exists
    $effect(() => {
        const result = homescreen.pages
            .filter(p => p.title !== selection)
            .find(p => p.title === input)

        if (result) {
            editBtnDisabled = true
        } else {
            editBtnDisabled = false
        }
    })

    // Functions ///////////////////////////////////////////////////////////////
    function onMoveUp() {
        if (!selection) { return }

        // Get index
        const index = homescreen.pages.findIndex(p => p.title === selection)

        if (index === 0) { return }

        const tmp = homescreen.pages[index]
        homescreen.pages[index] = homescreen.pages[index - 1]
        homescreen.pages[index - 1] = tmp
    }

    function onMoveDown() {
        if (!selection) { return }

        // Get index
        const index = homescreen.pages.findIndex(p => p.title === selection)

        if (index === homescreen.pages.length - 1) { return }

        const tmp = homescreen.pages[index]
        homescreen.pages[index] = homescreen.pages[index + 1]
        homescreen.pages[index + 1] = tmp
    }

    function onAdd() {
        // Find name
        const base = 'New Page'
        let counter = 1
        let name = base

        while (true) {
            const result = homescreen.pages.find(p => p.title === name)
            if (result) {
                name = `${base} ${counter}`
                counter += 1
            } else {
                break
            }
        }

        // Add page
        homescreen.pages.push({
            title: name,
            grid: []
        })
    }

    function onEdit() {
        if (!selection) { return }

        // Toggle edit mode
        editMode = !editMode

        if (editMode) {
            // If edit mode is entered, fill input field
            const page = homescreen.pages.find(p => p.title === selection)
            if (!page) { return }

            input = page.title

        } else if (input) {
            // If edit mode is exited and the input is set, apply title
            const page = homescreen.pages.find(p => p.title === selection)
            if (!page) { return }

            page.title = input
            input = undefined
        }
    }

    function onDelete() {
        if (!selection) { return }

        homescreen.pages = homescreen.pages.filter(p => p.title !== selection)
    }

    function onClickPage(pageTitle: string) {
        // In edit mode changing the selection is prevented
        if (editMode) { return }

        // Change selection
        selection = pageTitle

        // When selection changes 
    }

    function onClickSelected() {
        // Unset selection
        selection = undefined
    }

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->
<Card.Root class="h-fit max-h-full flex flex-col">
    <Card.Header>
        <Card.Title>Manage Pages</Card.Title>
        <Card.Description>
            Create, Modify or Delete Pages.
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll flex flex-col space-y-6">
        <!-- Edit Bar -->
        <div
            class="
                bg-zinc-50 dark:bg-zinc-800
                w-full h-12 p-2

                flex flex-row justify-between items-center
                rounded-md
                border-[0.5px] border-zinc-100 dark:border-zinc-700/50
            "
        >
            <!-- Left -->
            <div class="px-1">
                <p class="text-zinc-500 dark:text-zinc-200 line-clamp-1">
                    Please select a page
                </p>
            </div>

            <!-- Right -->
            <div class="flex flex-row space-x-3 items-center">
                <!-- Move Left -->
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="ghost"
                            size="icon"
                            on:click={onMoveUp}
                        >
                            <ChevronUp />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Move Page up</p>
                    </Tooltip.Content>
                </Tooltip.Root>

                <!-- Move Right -->
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="ghost"
                            size="icon"
                            on:click={onMoveDown}
                        >
                            <ChevronDown />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Move Page down</p>
                    </Tooltip.Content>
                </Tooltip.Root>

                <!-- Separator -->
                <div class="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>

                <!-- Add -->
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            disabled={editBtnDisabled}
                            builders={[builder]}
                            variant="ghost"
                            size="icon"
                            on:click={onAdd}
                        >
                            <Plus />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Add Page</p>
                    </Tooltip.Content>
                </Tooltip.Root>

                <!-- Edit -->
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            disabled={editBtnDisabled}
                            builders={[builder]}
                            variant={editMode ? 'default' : 'ghost'}
                            size="icon"
                            on:click={onEdit}
                        >
                            <Pencil1 />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Edit Page</p>
                    </Tooltip.Content>
                </Tooltip.Root>

                <!-- Separator -->
                <div class="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-600"></div>

                <!-- Delete -->
                <Tooltip.Root>
                    <Tooltip.Trigger asChild let:builder>
                        <Button
                            disabled={deleteBtnDisabled}
                            builders={[builder]}
                            variant="destructive"
                            size="icon"
                            on:click={onDelete}
                        >
                            <Trash />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p>Delete Page</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            </div>
        </div>

        <!-- Page List -->
        <div class="flex flex-col space-y-3">
            {#each homescreen.pages as page (page)}
                <div
                    animate:flip={{ duration: 200 }}
                    class="w-full h-10 flex flex-row items-center"
                >
                    {#if page.title === selection}
                        <div
                            class="bg-zinc-100 dark:bg-zinc-600 w-full h-full rounded-md"
                        >
                            {#if !editMode}
                                <button
                                    class="w-full h-full"
                                    on:click={onClickSelected}
                                >
                                    {page.title}
                                </button>
                            {:else}

                                <div class="w-full h-full flex flex-row space-x-2">
                                    <Input
                                        bind:value={input}
                                        class="
                                            dark:bg-zinc-500
                                            !ring-inset
                                            h-full text-center text-md
                                        "
                                    />
                                </div>
                            {/if}
                        </div>

                    {:else}
                        <button
                            class="w-full h-full"
                            on:click={() => onClickPage(page.title)}
                        >
                            {page.title}
                        </button>
                    {/if}
                </div>
            {/each}
        </div>

    </Card.Content>

    <Card.Footer class="flex flex-row-reverse pt-4 pr-7">
        <Button onclick={() => dialogs.managePages = false}>Close</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
