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
        syncId?: string,
        password?: string,
    };

    let {
        mode,
        name: _name,
        syncId: _syncId,
        password: _password,
    }: Props = $props();

    // State ///////////////////////////////////////////////////////////////////
    let oldName: string = _name || '';

    let name = $state<string>(_name || '')
    let syncId = $state<string>(_syncId || '')
    let password = $state<string>(_password || '')

    let error = $state<string | undefined>()

    // Functions ///////////////////////////////////////////////////////////////
    function onCreate() {
        let res = profiles.add({
            name,
            backend: 'xbs',
            credentials: { syncId, password },
        });

        if (res.err) { error = res.val }
        else { error = undefined }
    }

    function onUpdate() {
        let res = profiles.update(oldName, {
            name,
            backend: 'xbs',
            credentials: { syncId, password },
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

    <!-- sync id input -->
    <div class="grid w-full items-center gap-1.5 pt-3 pb-3">
        <Label for='xbs-sid' class="">xBrowserSync Sync ID</Label>
        <Input
            id='xbs-sid'
            type='text'
            class="font-mono"
            placeholder='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            bind:value={syncId}
        />
        <p class="text-sm text-muted-foreground">Enter your sync id.</p>
    </div>

    <!-- password input -->
    <div class="grid w-full items-center gap-1.5 pt-3">
        <Label for='xbs-pw' class="">Password</Label>
        <Input
            id='xbs-pw'
            type='password'
            class="font-mono"
            placeholder='••••••••••••••••'
            bind:value={password}
        />
        <p class="text-sm text-muted-foreground">Enter your password.</p>
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
            <Button variant="secondary" onclick={onCreate}>
                Create
            </Button>

        {:else if mode === 'update'}
            <Button variant="secondary" onclick={onUpdate}>
                Apply
            </Button>

            <Button variant="destructive" onclick={onDelete}>
                Delete
            </Button>

        {/if}
    </div>
</div>

<!-- ----------------------------------------------------------------------- -->
