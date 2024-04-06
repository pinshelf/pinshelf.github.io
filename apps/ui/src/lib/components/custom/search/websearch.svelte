<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    // import type { IBookmark } from "$lib/backends";

    // Props ///////////////////////////////////////////////////////////////////
    type Props = { isFirst?: boolean, search: string };
    let { isFirst, search }: Props = $props()

    // State ///////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////
</script>

<!-- Template -------------------------------------------------------------- -->

<!-- Actual entry -->
<div class="p-1.5 mt-2 h-12 dark:hover:bg-zinc-800 rounded-md flex flex-row items-center space-x-1">
    <!-- Icon -->
    <div class="w-8 h-full flex flex-row items-start justify-center">
        <img
            class="w-5 h-5 rounded-sm mt-[3px]"
            src="http://icon.horse/icon/duckduckgo.org"
            alt="icon"
        />
    </div>

    <!-- Content -->
    <div class="w-full h-full flex flex-row">
        <!-- Title, Description, URL, Directory -->
        <div class="w-full h-full flex flex-col justify-between">
            <!-- Details -->
            <div>
                <p class="text-[13px] line-clamp-1 select-none">{search}</p>
                <!-- <p class="text-[12px] font-normal line-clamp-1 text-zinc-600 dark:text-zinc-300 select-none">{bookmark.description}</p> -->
                <p class="text-[12px] font-mono line-clamp-1 text-zinc-500 dark:text-zinc-400 select-none">{`https://duckduckgo.org?q=${encodeURI(search)}`}</p>
            </div>
        </div>
    </div>

    <!-- Shortcut -->
    <!-- <div class="w-6 h-full bg-green-500">x</div> -->
</div>

<!-- ----------------------------------------------------------------------- -->
