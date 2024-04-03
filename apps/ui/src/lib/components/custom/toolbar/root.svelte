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
<div
    class="
        bg-white
        w-full
        h-16
        p-2

        flex items-center justify-between

        border-b-[0.5px]
        border-zinc-50
        shadow
    "
>
    <div
        class="
            bg-white
            h-full

            flex items-center justify-start space-x-2
        "
    >
        {@render left()}
    </div>

    <div
        class="
            bg-blue-50
            h-12

            flex items-center justify-center space-x-2

            absolute
            left-1/2
            -translate-x-1/2
            top-2

        "
    >
        {@render middle()}
    </div>

    <div
        class="
            bg-green-50
            h-full

            flex items-center justify-end space-x-2
        "
    >
        {@render right()}
    </div>

</div>


<!-- ----------------------------------------------------------------------- -->
