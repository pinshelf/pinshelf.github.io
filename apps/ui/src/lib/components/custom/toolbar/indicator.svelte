<script lang="ts">
    let { show }: { show?: boolean } = $props()
</script>

{#if show}
    <span class="absolute right-[2px] translate-x-1/2 top-[2px] -translate-y-1/2 flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
    </span>
{/if}