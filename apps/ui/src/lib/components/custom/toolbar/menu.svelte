<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
    import { Button } from '$lib/components/ui/button';
    import * as Select from "$lib/components/ui/select";

    import { page } from '$app/stores';
    import { HamburgerMenu } from 'radix-icons-svelte';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        profiles: { id: number, name: string }[],
        activeProfile: { id: number, name: string } | null,
    }

    let {
        profiles,
        activeProfile = $bindable(),
    }: Props = $props();

    // Types ///////////////////////////////////////////////////////////////////
    type Route = 'home' | 'explorer'

    // State ///////////////////////////////////////////////////////////////////

    // Current route
    let route: Route | null = $state(null)

    // Menu state
    let menuOpen = $state(false)

    // Indicator flags
    let selectProfileIndicator = $derived(activeProfile === null)
    let createProfileIndicator = $derived(profiles.length === 0)

    // Effects /////////////////////////////////////////////////////////////////

    // On Load
    $effect(() => {
        let routeRaw = $page.route.id
        switch (routeRaw) {
            case '/': {
                route = 'home'
                break;
            }

            case '/explorer': {
                route = 'explorer'
                break;
            }

            default: {
                route = null
                break;
            }
        }
    })

    // Functions ///////////////////////////////////////////////////////////////
    function onProfileChange(id: number) {
        activeProfile = profiles.find(p => p.id === id) || null
    }

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->

<!-- Profiles -->
<DropdownMenu.Root
    open={menuOpen}
    onOpenChange={(isOpen) => menuOpen = isOpen}
>
    <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} variant="outline" class="relative p-2.5 xl:px-4 xl:py-2">
            <span class="hidden xl:block">{ activeProfile ? activeProfile.name : 'Profile'}</span>
            <HamburgerMenu class="p-0 xl:hidden"/>

            <!-- Indicator -->
            {#if selectProfileIndicator && menuOpen === false}
                <span class="absolute right-[2px] translate-x-1/2 top-[2px] -translate-y-1/2 flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
            {/if}
        </Button>

        <!-- <Button builders={[builder]} variant="outline" class="p-2.5 xl:hidden !m-0 relative">
            {#if selectProfileIndicator && menuOpen === false}
                <span class="absolute right-[2px] translate-x-1/2 top-[2px] -translate-y-1/2 flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
            {/if}
        </Button> -->
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="min-w-64">
        <DropdownMenu.Label>Profile</DropdownMenu.Label>

        <!-- Profile selector -->
        <div class="px-2 py-1.5">
            <Select.Root
                disabled={profiles.length === 0}
                selected={activeProfile
                    ? { value: activeProfile.id }
                    : { value: undefined}
                }
                onSelectedChange={(x) => onProfileChange((x as any).value)}
            >
                <Select.Trigger class="focus:ring-0">
                    <Select.Value
                        placeholder={activeProfile
                            ? activeProfile.name
                            : 'Select Profile'
                        }
                    />
                </Select.Trigger>

                <Select.Content>
                    {#each profiles as profile}
                        <Select.Item value={profile.id}>
                            {profile.name}
                        </Select.Item>
                    {/each}
                </Select.Content>

            </Select.Root>
        </div>

        <!-- Manage profiles button -->
        <div class="px-2 py-1.5">
            <Button class="w-full relative">
                Manage Profiles

                <!-- Indicator -->
                {#if createProfileIndicator}
                    <span class="absolute right-[2px] translate-x-1/2 top-[2px] -translate-y-1/2 flex h-3 w-3">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                {/if}
            </Button>
        </div>

        <!-- Naviation -->
        {#if !!activeProfile}
            <DropdownMenu.Separator class="xl:hidden"/>
            <DropdownMenu.Label class="xl:hidden">Navigation</DropdownMenu.Label>

            <DropdownMenu.Item
                href="/"
                class="xl:hidden cursor-pointer"
            >
                Home
            </DropdownMenu.Item>

            <DropdownMenu.Item
                href="/explorer"
                class="xl:hidden cursor-pointer"
            >
                Explorer
            </DropdownMenu.Item>
        {/if}

    </DropdownMenu.Content>
</DropdownMenu.Root>

{#if !!activeProfile}
    <!-- Home -->
    <Button
        href="/"
        variant={route === 'home' ? "secondary" : "ghost"}
        class="hidden xl:block"
    >
        Home
    </Button>

    <!-- Explorer -->
    <Button
        href="/explorer"
        variant={route === 'explorer' ? 'secondary' : 'ghost'}
        class="hidden xl:block"
    >
        Explorer
    </Button>
{/if}




<!-- ----------------------------------------------------------------------- -->
