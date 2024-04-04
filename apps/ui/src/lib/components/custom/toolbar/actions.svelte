<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Gear, Pencil2 } from 'radix-icons-svelte'
    import { ModeToggle } from '$lib/components/custom/mode-toggle';
    import * as Tooltip from '$lib/components/ui/tooltip';

    let { activeProfile }: { activeProfile: boolean } = $props();

</script>

<!-- HTML ------------------------------------------------------------------ -->
{#if activeProfile}
    <!-- Edit homescreen button -->
    <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline" size="icon" class="hidden md:flex"
            >
                <Pencil2/>
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content class="translate-y-1">
            <p>Edit Homescreen</p>
        </Tooltip.Content>
    </Tooltip.Root>

    <!-- Settings button -->
    <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
            <Button
                builders={[builder]}
                variant="outline" size="icon" class="hidden md:flex"
            >
                <Gear/>
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content class="translate-y-1">
            <p>Settings</p>
        </Tooltip.Content>
    </Tooltip.Root>
{/if}

<!-- Theme toggle button -->
<ModeToggle class="hidden md:block" />


<!-- ----------------------------------------------------------------------- -->
