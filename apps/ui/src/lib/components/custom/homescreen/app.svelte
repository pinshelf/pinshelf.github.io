<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    type Props = {
        id: string,
        title: string,
        iconUrl: string,
        url: string,

        // onClick?: (id: string, url: string) => void,
        onClick?: () => void
    }

    let { id, title, iconUrl, url, onClick}: Props = $props()

</script>

<!-- HTML ------------------------------------------------------------------ -->

<div class="w-full h-full min-w-20 flex flex-col items-center justify-center">
    <!-- Hit Box -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <button class="
            flex flex-col justify-center items-center
            p-1 space-y-2
            cursor-pointer
            w-full
        "
        on:click={onClick}
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
