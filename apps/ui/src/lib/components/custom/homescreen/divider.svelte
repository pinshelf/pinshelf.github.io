


<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    type Props = {
        id: string,
        text: string,
        onClick?: () => void,
    }
    let { id, text, onClick }: Props = $props();

</script>

<!-- HTML ------------------------------------------------------------------ -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="h-full w-full flex flex-col justify-end space-y-1 px-1"
    on:click={() => {
        if (onClick) { onClick() }
    }}
>
    <!-- Text -->
    <div class="px-2">
        <p class="select-none font-bold text-zinc-500 dark:text-zinc-300">{text}</p>
    </div>

    <!-- Divider Line -->
    <div class="w-full h-[2px] rounded-full bg-zinc-200 dark:bg-zinc-700" />

    <!-- Spacer -->
    <div class="w-full h-1" />
</div>

<!-- ----------------------------------------------------------------------- -->
