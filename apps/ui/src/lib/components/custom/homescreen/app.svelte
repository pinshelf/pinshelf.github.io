<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import type { App } from '$lib/types';
    import { bookmarks } from '$lib/state/data'
    import { getIconUrl } from 'url-icons'

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        app: App,
        onClick?: (id: string, url?: string) => void
    }

    let { app, onClick}: Props = $props()

    // State ///////////////////////////////////////////////////////////////////
    let title = $state<string>()
    let url = $state<string>()
    let iconUrl = $state<string>()

    $effect(() => {
        const { bookmarkId, overwrites } = app;

        // Get bookmark
        const result = bookmarks.findById(bookmarkId)
        if (result.none) return;
        const bookmark = result.unwrap();

        // Set title
        if (overwrites?.title) { title = overwrites.title }
        else { title = bookmark.title }

        // Set url
        url = bookmark.url

        // Set icon url
        if (overwrites?.iconUrl) { iconUrl = overwrites.iconUrl }
        else { iconUrl = getIconUrl(url) }
    })

    function _onClick() {
        if (onClick) { onClick(app.id, url) }
    }

</script>

<!-- HTML ------------------------------------------------------------------ -->

<div class="w-full h-full flex flex-col items-center justify-center">
    <!-- Hit Box -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button class="
            flex flex-col justify-center items-center
            p-1 space-y-2
            cursor-pointer
            w-full
        "
        on:click={_onClick}
    >
        <!-- Icon -->
        <div class="
            w-16 h-16
            rounded-2xl overflow-hidden

            bg-zinc-200 dark:bg-zinc-700
            border-[0.5px] border-zinc-300 dark:border-zinc-800
            shadow dark:shadow-zinc-950
        ">
            <img
                src={iconUrl}
                alt="icon"
                class="w-full h-full"
            />
        </div>

        <!-- Title -->
        <div class="w-full h-fit">
            <p class="
                line-clamp-1 select-none
                text-zinc-600 dark:text-zinc-200
            ">{title}</p>
        </div>
    </button>
</div>


<!-- ----------------------------------------------------------------------- -->
