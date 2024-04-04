<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Stack } from 'radix-icons-svelte'
    import * as Tooltip from '$lib/components/ui/tooltip';


</script>

<!-- HTML ------------------------------------------------------------------ -->
<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder>
        <Button
            builders={[builder]}
            variant="ghost" size="icon" class="h-8 w-8"
        >
            <Stack />
        </Button>
    </Tooltip.Trigger>
    <Tooltip.Content class="translate-y-2 sm:-translate-y-2">
        <p>Manage Pages</p>
    </Tooltip.Content>
</Tooltip.Root>


<!-- ----------------------------------------------------------------------- -->
