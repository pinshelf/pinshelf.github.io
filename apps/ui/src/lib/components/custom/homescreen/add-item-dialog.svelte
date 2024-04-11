<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as Tabs from "$lib/components/ui/tabs";

    import { ChevronUp, ChevronDown, Pencil1, Trash, Plus } from 'radix-icons-svelte'

    // Stores //////////////////////////////////////////////////////////////////
    import { dialogs } from '$lib/state/aux';
    import { homescreen } from '$lib/state/data';

    // Props ///////////////////////////////////////////////////////////////////

    // State ///////////////////////////////////////////////////////////////////
    let tab = $state<'app' | 'divider'>('divider')

    // Effects /////////////////////////////////////////////////////////////////

    // Functions ///////////////////////////////////////////////////////////////
    function onAdd() {
        // Add divider
        if (tab === 'divider') {
            homescreen.addDivider('asdf')
        }

        // Add tab
        else if (tab === 'app') {

        }

        dialogs.addItem = false
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
        <!-- Tabs -->
        <Tabs.Root bind:value={tab} class="">
            <Tabs.List class="w-full">
                <Tabs.Trigger value="app" class="w-full">App</Tabs.Trigger>
                <Tabs.Trigger value="divider" class="w-full">Divider</Tabs.Trigger>
            </Tabs.List>

            <!-- App -->
            <div class="w-full h-64">
            {#if tab === 'app'}
                <Tabs.Content value="app" class="w-full h-full bg-red-800">
                    <p>HI</p>
                </Tabs.Content>

            <!-- Divider -->
            {:else if tab === 'divider'}
                <Tabs.Content value="divider" class="w-full h-full bg-green-800">
                    <p>asdf</p>
                </Tabs.Content>

            {/if}
            </div>
        </Tabs.Root>
    </Card.Content>

    <Card.Footer class="flex flex-row justify-between pt-4 pr-7">
        <Button variant="secondary" onclick={() => dialogs.addItem = false}>Close</Button>
        <Button onclick={onAdd}>Add</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
