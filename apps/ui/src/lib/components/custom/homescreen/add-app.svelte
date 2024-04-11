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
        <Card.Title>Add App</Card.Title>
        <Card.Description>
            Add a new App
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll flex flex-col space-y-6">
        

    </Card.Content>

    <Card.Footer class="flex flex-row-reverse pt-4">
        <Button onclick={() => dialogs.managePages = false}>Close</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
