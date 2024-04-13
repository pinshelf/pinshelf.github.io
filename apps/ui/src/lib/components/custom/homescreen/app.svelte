<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import type { App } from '$lib/types';
    import { bookmarks } from '$lib/state/data'
    import { getIconUrl, type IconUrl } from 'url-icons'

    // Props ///////////////////////////////////////////////////////////////////
    type Props = {
        app: App,
        onClick?: (id: string, url?: string) => void
    }

    let { app, onClick}: Props = $props()

    // State ///////////////////////////////////////////////////////////////////
    let title = $state<string>()
    let url = $state<string>()
    let iconUrl = $state<IconUrl>()

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
        if (overwrites?.iconUrl) {
            iconUrl = {
                url: overwrites.iconUrl,
                attribution: { source: overwrites.iconUrl },
                renderInfo: { type: 'as-is' },
            }
        }
        else {
            iconUrl = getIconUrl(url)
        }
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

            border-[0.5px] border-zinc-300 dark:border-zinc-800
            shadow dark:shadow-zinc-950
        ">
            {#if iconUrl}
                {#if iconUrl.renderInfo.type === 'as-is'}
                    <img
                        src={iconUrl.url}
                        alt="icon"
                        class="w-full h-full"
                    />

                {:else if iconUrl.renderInfo.type === 'padded'}
                    <div class="w-full h-full p-2 bg-zinc-100">
                        <img
                            src={iconUrl.url}
                            alt="icon"
                            class="w-full h-full"
                        />
                    </div>
                {/if}
            {/if}
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
