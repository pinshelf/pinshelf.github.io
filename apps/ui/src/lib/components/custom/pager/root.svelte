<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    type Props = {
        left: any,
        middle: any,
        right: any,
    }
    let { left, middle, right }: Props = $props();

</script>

<!-- HTML ------------------------------------------------------------------ -->

<!-- Pager Container -->
<div
    class="
        bg-zinc-100 dark:bg-zinc-800
        w-full h-10 px-2
        fixed top-0 sm:top-auto sm:bottom-0

        flex items-center justify-between

        border-b-[0.5px] sm:border-b-0 sm:border-t-[0.5px]
        border-zinc-200 dark:border-zinc-700/50
        shadow-[inset_0_1px_3px_0_rgba(0,0,0,0.05)]
    ">
    <!-- Left -->
    <div class="h-full flex items-center justify-start space-x-2">
        {@render left()}
    </div>

    <!-- Middle -->
    <div
        class="
            h-9
            flex items-center justify-center space-x-2
            absolute left-1/2 -translate-x-1/2
        "
    >
        {@render middle()}
    </div>

    <!-- Right -->
    <div class="h-full flex items-center justify-end space-x-2">
        {@render right()}
    </div>
</div>

<!-- ----------------------------------------------------------------------- -->
