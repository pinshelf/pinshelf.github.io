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
    import { type App } from '$lib/types';
    import { type IBookmark } from '$lib/backends';
    import { getIconUrl, type IconUrl } from 'url-icons';

    // Props ///////////////////////////////////////////////////////////////////


    // State ///////////////////////////////////////////////////////////////////
    let app = $state<App | undefined>()
    let bookmark = $state<IBookmark | undefined>()

    let title = $state<string>()
    let url = $state<string>()
    let iconUrl = $state<IconUrl>()

    let titleInput = $state<string>()
    let iconUrlInput = $state<string>()
    let defaultIconInfo = $derived(bookmark ? getIconUrl(bookmark.url) : undefined)

    // Effects /////////////////////////////////////////////////////////////////
    $effect(() => {
        const selection = homescreen.selectedForEdit
        if (!selection) { return }

        // Find selected app
        for (const x of homescreen.currentPage.grid) {
            if (x.type !== 'app') { continue }
            if (x.id !== selection) { continue }

            // Set app
            app = x;

            // Find bookmark
            let bm = bookmarks.findById(app.bookmarkId)

            // Set bookmark
            if (bm.some) { bookmark = bm.val }

            break;
        }
    })

    $effect(() => {
        // Set title
        if (app?.overwrites?.title) {
            title = app.overwrites.title
            titleInput = title
        }
        else { title = bookmark?.title }

        // Set url
        url = bookmark?.url

        // Set icon url
        if (app?.overwrites?.iconUrl) {
            iconUrl = {
                url: app.overwrites.iconUrl,
                attribution: { source: app.overwrites.iconUrl },
                renderInfo: { type: 'as-is' },
            }

            iconUrlInput = iconUrl.url
        }
        else if (url) { iconUrl = getIconUrl(url) }
    })

    // Update title on input change
    $effect(() => {
        if (app) {
            if (app.overwrites) {
                app.overwrites.title = titleInput

            } else {
                app.overwrites = { title: titleInput }
            }
        }
    })

    $effect(() => {
        if (app) {
            if (app.overwrites) {
                app.overwrites.iconUrl = iconUrlInput

            } else {
                app.overwrites = { iconUrl: iconUrlInput }
            }
        }
    })

    // Functions ///////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- HTML ------------------------------------------------------------------ -->
<Card.Root class="h-fit max-h-full flex flex-col">
    <Card.Header>
        <Card.Title>Edit App</Card.Title>
        <Card.Description>
            Edit App "{title ? title : '...'}"
        </Card.Description>
    </Card.Header>

    <Card.Content class="overflow-y-scroll flex flex-col space-y-6 p-6">
        <!-- Bookmark ID -->
        <Label for="bmid">Bookmark ID</Label>
        <Input id="bmid" disabled value={app ? app.bookmarkId : '...'} class="!mt-2" />

        <!-- URL -->
        <Label for="url">URL</Label>
        <Input id="url" disabled value={url ? url : '...'} class="!mt-2" />

        <!-- Divider -->
        <div class="flex flex-col pt-3 space-y-3">
            <div class="border-b-[1px] dark:border-zinc-800"/>
            <p class="font-bold text-md">Overwrites</p>
        </div>

        <!-- Title -->
        <Label for="title">Title</Label>
        <Input
            id="title"
            bind:value={titleInput} class="!mt-2"
            placeholder={bookmark ? bookmark.title : ''}
        />

        <!-- Icon URL -->
        <Label for="iconUrl">Icon Url</Label>
        <Input
            id="iconUrl"
            bind:value={iconUrlInput} class="!mt-2"
            placeholder={iconUrl?.url}
        />

        <!-- Render Default Icon Attribution -->
        {#if defaultIconInfo}
            <p class="text-sm my-2">
            Default app image published <a class="underline" href={defaultIconInfo.attribution.source} target="_blank">here</a>

            {#if defaultIconInfo.attribution.license}
                (under <a class="underline" href={defaultIconInfo.attribution.license.link} target="_blank">{defaultIconInfo.attribution.license.name}</a> license)
            {/if}

            {#if defaultIconInfo.attribution.author}
                created by <span>{defaultIconInfo.attribution.author}</span>
            {/if}
            .
            </p>
        {/if}

    </Card.Content>

    <Card.Footer class="flex flex-row-reverse pt-4 pr-7">
        <Button onclick={() => dialogs.editApp = false}>Close</Button>
    </Card.Footer>

</Card.Root>

<!-- ----------------------------------------------------------------------- -->
