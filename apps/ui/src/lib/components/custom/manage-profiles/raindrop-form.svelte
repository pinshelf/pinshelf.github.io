<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { Label } from '$lib/components/ui/label';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import profiles from '$lib/state/profiles.svelte';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        mode: 'create' | 'update',

        name?: string,
        token?: string,
    };

    let { mode, name: _name, token: _token }: Props = $props();

    // State ///////////////////////////////////////////////////////////////////
    let oldName: string = _name || '';
    let name = $state(_name || '')
    let token = $state(_token || '')

    let error = $state<string | undefined>()

    // Functions ///////////////////////////////////////////////////////////////
    function onCreate() {
        let res = profiles.add({
            name,
            backend: 'raindrop',
            credentials: { token },
        });

        if (res.err) { error = res.val }
        else { error = undefined }
    }

    function onUpdate() {
        let res = profiles.update(oldName, {
            name,
            backend: 'raindrop',
            credentials: { token },
        })

        if (res.err) { error = res.val }
        else { error = undefined }
    }

    function onDelete() {
        profiles.remove(oldName)
    }

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- Template -------------------------------------------------------------- -->

<div class="p-2">
    <!-- profile name -->
    <div class="grid w-full items-center gap-1.5 pb-3">
        <Label for='profile-name' class="">Profile Name</Label>
        <Input
            id='profile-name'
            type='text'
            class="font-mono"
            placeholder='Home, Personal, Work, ...'
            bind:value={name}
        />
        <p class="text-sm text-muted-foreground">Enter the profile name</p>
    </div>

    <!-- password input -->
    <div class="grid w-full items-center gap-1.5 pt-3">
        <Label for='rd-token' class="">Token</Label>
        <Input
            id='rd-token'
            type='password'
            class="font-mono"
            placeholder='••••••••••••••••'
            bind:value={token}
        />
        <p class="text-sm text-muted-foreground">Enter the "Test Token" from your Raindrop.io settings.</p>
    </div>

    <!-- error -->
    {#if error !== undefined}
        <div class="pt-1.5 h-6">
            <span class="text-red-600">
                {#if error.length > 0}
                    Failed:
                {:else}
                    Failed
                {/if}
            </span>
            {#if error.length > 0}
                <span class="text-red-600">{error}</span>
            {/if}
        </div>
    {:else}
        <div class="pt-1.5 h-6"></div>
    {/if}

    <!-- buttons -->
    <div class="pt-3 flex justify-between flex-row-reverse">
        {#if mode === 'create'}
            <Button
                variant="secondary"
                onclick={onCreate}
            >Create</Button>

        {:else if mode === 'update'}
            <Button
                variant="secondary"
                onclick={onUpdate}
            >
                Apply
            </Button>

            <Button
                variant="destructive"
                onclick={onDelete}
            >
                Delete
            </Button>

        {/if}
    </div>
</div>

<!-- ----------------------------------------------------------------------- -->
