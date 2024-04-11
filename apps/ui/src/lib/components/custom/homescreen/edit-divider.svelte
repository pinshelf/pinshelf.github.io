<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import { Input } from "$lib/components/ui/input";
    import { Label } from '$lib/components/ui/label';

    // Stores //////////////////////////////////////////////////////////////////
    import { dialogs } from '$lib/state/aux';
    import { bookmarks, homescreen } from '$lib/state/data';
    import { type Divider } from '$lib/types';
    import { type IBookmark } from '$lib/backends';
    import { getIconUrl } from 'url-icons';

    // Props ///////////////////////////////////////////////////////////////////


    // State ///////////////////////////////////////////////////////////////////
    let divider = $state<Divider | undefined>()

    let titleInput = $state<string>()

    // Effects /////////////////////////////////////////////////////////////////
    $effect(() => {
        const selection = homescreen.selectedForEdit
        if (!selection) { return }

        // Find selected app
        for (const x of homescreen.currentPage.grid) {
            if (x.type !== 'divider') { continue }
            if (x.id !== selection) { continue }

            // Set divider
            divider = x;

            titleInput = divider.title

            break;
        }
    })

    // Update title on input change
    $effect(() => {
        if (divider) {
            divider.title = titleInput || ''
        }
    })

    // Functions ///////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->
<Card.Root class="h-fit max-h-full flex flex-col">
    <Card.Header>
        <Card.Title>Edit Divider</Card.Title>
        <Card.Description>
            Edit Divider "{divider ? divider.title : '...'}"
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll flex flex-col space-y-6 p-6">
        <!-- Title -->
        <Label for="title">Title</Label>
        <Input
            id="title"
            bind:value={titleInput} class="!mt-2"
            placeholder={divider ? divider.title : ''}
        />

    </Card.Content>

    <Card.Footer class="flex flex-row-reverse pt-4 pr-7">
        <Button onclick={() => dialogs.editDivider = false}>Close</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
