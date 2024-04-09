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

<!-- Wrapper - controls positioning (top/bottom) and floating (padding) -->
<!-- zinc-700 = rgb(63,63,70) -->
<div class="w-full p-3 sm:p-0 fixed bottom-0 top-auto sm:top-0 sm:bottom-auto z-10">
    <!-- Toolbar Container -->
    <div
        class="
            bg-white dark:bg-zinc-900
            w-full h-16 p-2
            flex items-center justify-between space-x-2 md:space-x-0

            rounded-md sm:rounded-none
            border-[0.5px] sm:border-x-0 sm:border-t-0 sm:border-b-[0.5px] 
            border-zinc-50 dark:border-zinc-700/50
            shadow
            dark:shadow-[0_0.5px_2px_1px_rgba(63,63,70,0.3)]
        "
    >
        <!-- Left -->
        <div class="h-full flex items-center justify-start space-x-2">
            {@render left()}
        </div>

        <!-- Middle -->
        <div
            class="
                h-12
                w-full md:w-[62%] md:max-w-[540px] lg:w-[540px]
                flex items-start justify-center space-x-2
                relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-2
            "
        >
            {@render middle()}
        </div>

        <!-- Right (>= md) -->
        <div class="h-full hidden md:flex items-center justify-end space-x-2">
            {@render right()}
        </div>

    </div>
</div>

<!-- ----------------------------------------------------------------------- -->
