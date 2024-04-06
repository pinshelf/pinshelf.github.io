<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
    import { Button } from '$lib/components/ui/button';
    import * as Select from "$lib/components/ui/select";

    import { page } from '$app/stores';
    import { Gear, HamburgerMenu, Pencil2 } from 'radix-icons-svelte';
    import { ModeToggle } from '$lib/components/custom/mode-toggle';
    import Indicator from './indicator.svelte'
    import type { Profile } from '$lib/types';

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        profiles: Profile[],
        activeProfile?: Profile,
        manageProfilesDialogOpen: boolean,
        onProfileChange: (profileName: string) => void
    }

    let {
        profiles,
        activeProfile,
        manageProfilesDialogOpen = $bindable(),
        onProfileChange,
    }: Props = $props();

    // Types ///////////////////////////////////////////////////////////////////
    type Route = 'home' | 'explorer'

    // State ///////////////////////////////////////////////////////////////////

    // Current route
    let route: Route | null = $state(null)

    // Menu state
    let menuOpen = $state(false)

    // Indicator flags
    let selectProfileIndicator = $derived(activeProfile === undefined)
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


    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->

<!--
    Dropdown:
    On large screens the dropdown only contains profile related elements.
    On medium screens the dropdown becomes a hamburger menu and also takes
    the navigation buttons.
    On small screens the quick-action buttons also move to the dropdown.
-->
<DropdownMenu.Root bind:open={menuOpen}>
    <!-- Dropdown Trigger -->
    <DropdownMenu.Trigger asChild let:builder>
        <Button
            builders={[builder]}
            variant="outline"
            class="relative p-2.5 xl:px-4 xl:py-2"
        >
            <!-- Text (>= xl) -->
            <span
                class="hidden xl:block max-w-28 truncate"
            >
                { activeProfile ? activeProfile.name : 'Profile'}
            </span>

            <!-- Hamburger Icon (< xl) -->
            <HamburgerMenu class="p-0 xl:hidden"/>

            <!-- Indicator -->
            <Indicator show={selectProfileIndicator && menuOpen === false} />
        </Button>
    </DropdownMenu.Trigger>

    <!-- Dropdown Content -->
    <DropdownMenu.Content
        class="
            min-w-64
            -translate-y-4 sm:translate-y-0
            translate-x-[3px] sm:translate-x-0
        "
    >
        <!-- Profile Sectino -->
        <DropdownMenu.Label>Profile</DropdownMenu.Label>

        <!-- Profile selector (wrapped in div for padding) -->
        <div class="px-2 py-1.5">
            <Select.Root
                disabled={profiles.length === 0}
                selected={activeProfile
                    ? { value: activeProfile.name }
                    : { value: undefined}
                }
                onSelectedChange={(x) => onProfileChange((x as any).value)}
            >
                <!-- Selector Trigger -->
                <Select.Trigger class="focus:ring-0">
                    <!-- Uses current profile name as placeholder if set -->
                    <Select.Value
                        placeholder={activeProfile
                            ? activeProfile.name
                            : 'Select Profile'
                        }
                    />
                </Select.Trigger>

                <!-- Selector Content -->
                <Select.Content>
                    {#each profiles as profile}
                        <Select.Item value={profile.name}>
                            {profile.name}
                        </Select.Item>
                    {/each}
                </Select.Content>

            </Select.Root>
        </div>

        <!-- Manage profiles button -->
        <div class="px-2 py-1.5">
            <Button class="w-full relative" onclick={() => {
                manageProfilesDialogOpen = true;
                menuOpen = false;
            }}>
                Manage Profiles

                <!-- Indicator -->
                <Indicator show={createProfileIndicator} />
            </Button>

        </div>

        <!-- Naviation Buttons (< xl) -->
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

        <!-- Icon Buttons -->
        <DropdownMenu.Separator class="md:hidden" />
        <DropdownMenu.Label class="md:hidden">Actions</DropdownMenu.Label>
        <div class="flex items-center justify-around md:hidden p-2">
            {#if !!activeProfile}
                <!-- Edit homescreen button -->
                <Button variant="outline" size="icon">
                    <Pencil2/>
                </Button>

                <!-- Settings button -->
                <Button variant="outline" size="icon">
                    <Gear/>
                </Button>
            {/if}

            <!-- Theme toggle button -->
            <ModeToggle />
        </div>

    </DropdownMenu.Content>
</DropdownMenu.Root>

<!-- Navigation Buttons (>= xl) -->
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
