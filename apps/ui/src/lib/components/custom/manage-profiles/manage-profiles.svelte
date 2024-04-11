<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as Card from '$lib/components/ui/card';
    import * as Accordion from '$lib/components/ui/accordion';
    import { Button } from '$lib/components/ui/button';
    import { Person, Plus } from 'radix-icons-svelte'
    import XbsForm from './xbs-form.svelte'
    import RaindropForm from './raindrop-form.svelte';
    import type { Profile } from '$lib/types';


    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        profiles: Profile[],
        onClose?: () => void,
    };

    let { onClose, profiles }: Props = $props();

    // Functions ///////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- Template -------------------------------------------------------------- -->

<Card.Root class="h-fit max-h-full flex flex-col">
    <Card.Header>
        <Card.Title>Manage Profiles</Card.Title>
        <Card.Description>
            Create, Modify or Delete Profiles.
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll ">
        <Accordion.Root>
            {#each profiles as profile, index}
                <Accordion.Item value={`${index}`}>
                    <Accordion.Trigger>
                        <div class="flex items-center space-x-2">
                            <div class="dark:bg-zinc-700 rounded-full p-[2px]">
                                <Person size={16}/>
                            </div>
                            <span>{profile.name} ({profile.backend})</span>
                        </div>
                    </Accordion.Trigger>
                    <Accordion.Content>
                        {#if profile.backend === 'xbs'}
                            <XbsForm
                                mode='update'
                                name={profile.name}
                                syncId={profile.credentials.syncId as string}
                                password={profile.credentials.password as string}
                            />
                        {:else if profile.backend === 'raindrop'}
                            <RaindropForm
                                mode='update'
                                name={profile.name}
                                token={profile.credentials.token as string}
                            />
                        {/if}
                    </Accordion.Content>
                </Accordion.Item>
            {/each}

            <!-- Add "xbs" profile -->
            <Accordion.Item value={`${1_000_000}`}>
                <Accordion.Trigger>
                    <div class="flex items-center space-x-2">
                        <div class="dark:bg-zinc-700 rounded-full p-[2px]">
                            <Plus size={16}/>
                        </div>
                        <span>Add <b>xBrowserSync</b> Profile</span>
                    </div>
                </Accordion.Trigger>
                <Accordion.Content>
                    <XbsForm mode='create' />
                </Accordion.Content>
            </Accordion.Item>

            <!-- Add "raindrop" profile -->
            <Accordion.Item value={`${1_000_001}`}>
                <Accordion.Trigger>
                    <div class="flex items-center space-x-2">
                        <div class="dark:bg-zinc-700 rounded-full p-[2px]">
                            <Plus size={16}/>
                        </div>
                        <span>Add <b>Raindrop</b> Profile</span>
                    </div>
                </Accordion.Trigger>
                <Accordion.Content>
                    <RaindropForm mode='create' />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>

    </Card.Content>

    <Card.Footer class="flex flex-row-reverse pt-4 pr-7">
        <Button onclick={onClose}>Close</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
