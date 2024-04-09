<!-- Script ---------------------------------------------------------------- -->
<script lang="ts">
    // Imports /////////////////////////////////////////////////////////////////
    import { App as AppComponent, Divider as DividerComponent } from '$lib/components/custom/homescreen'
    import { homescreenItemType, type AppGroup, type Divider, type App } from '$lib/types'
    import { homescreen, bookmarks } from '$lib/state/data'
    import { getIconUrl } from 'url-icons';
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import Grid from "svelte-grid";

    
    // Types ///////////////////////////////////////////////////////////////////
    interface GridAppItem {
        type        : 'app',
        id          : string, // id of the item on the homescreen
        full        : App,    // needed for rebuilding grid after edits

        // Calculated properties (may be overwritten by 'overwrites')
        calculated  : {
            title       : string,
            iconUrl     : string,
            url         : string,
        }
    }

    interface GridDividerItem {
        type        : 'divider',
        id          : string, // id of the item on the homescreen
        full        : Divider,
    }

    type GridItem = (GridAppItem | GridDividerItem) & {
        4: SvelteGridProps,
        8: SvelteGridProps,
    }

    interface SvelteGridProps {
        fixed           : boolean,
        resizable       : boolean,
        draggable       : boolean,
        customDragger   : boolean,
        customResizer   : boolean,
        min             : {
            w: number,
            h: number,
        },
        max: {
            w: number,
            h: number
        },

        x               : number, // column
        y               : number, // row
        w               : number,
        h               : number,
    }

    // Constants ///////////////////////////////////////////////////////////////

    // Define responsive grid columns
    const cols = [
        // <= 1000  => 4 columns
        [ 700, 4 ],

        // <= 1000000 => 8 columns
        [ 1_000_000, 8 ],
    ]
        .sort((a, b) => a[0] - b[0]);

    // State ///////////////////////////////////////////////////////////////////
    let grid = $state<GridItem[]>([]);
    let tmpHomescreenPageGrid = $state<(AppGroup | Divider)[] | undefined>();


    // Effects /////////////////////////////////////////////////////////////////

    // When homescreen changes, update the grid
    $effect(() => {
        // Make sure homescreen and bookmarks are loaded
        if (homescreen.pages.length === 0 || bookmarks.all.length === 0) {
            return
        }

        // Temporary grid variable
        const tmpGrid: GridItem[] = []

        // Current row and column for the respective layout
        const current = {
            4: { row: 0, column: 0 },
            8: { row: 0, column: 0 },
        }

        // Enricht the entries of the current homescreen page
        for (const entry of homescreen.currentPage.grid) {
            // Check the type of the entry
            if (homescreenItemType(entry) === 'appGroup') {
                // Type guard
                const appGroup = entry as AppGroup;

                for (const [i, app] of appGroup.apps.entries()) {
                    // Calculate relative row and column for each layout
                    const relative = {
                        4: { row: Math.floor(i / 4), col: i % 4 },
                        8: { row: Math.floor(i / 8), col: i % 8 },
                    }

                    // Get bookmark for app
                    const bookmark = bookmarks.findById(app.bookmarkId)
                    if (bookmark.none) {
                        console.error(
                            `Cannot find homescreen app bookmark:
                            ${app.bookmarkId}`
                        )
                        continue
                    }

                    // Create grid configuration
                    const gridConf = {
                        4: gridHelp.item({
                            x: relative[4].col,
                            y: relative[4].row + current[4].row,
                            w: 1,
                            h: 1,
                            resizable: false,
                            draggable: homescreen.editMode,
                            // fixed: !homescreen.editMode,
                        }) as SvelteGridProps,

                        8: gridHelp.item({
                            x: relative[8].col,
                            y: relative[8].row + current[8].row,
                            w: 1,
                            h: 1,
                            resizable: false,
                            draggable: homescreen.editMode,
                            // fixed: !homescreen.editMode,
                        }) as SvelteGridProps,
                    }

                    // Combine app and bookmark information
                    const gridItem: GridItem = {
                        type        : 'app',
                        id          : app.id,
                        full        : app,

                        calculated  : {
                            title       : (() => {
                                if (app.overwrites?.title) {
                                    return app.overwrites.title

                                } else {
                                    return bookmark.val.title
                                }
                            })(),

                            iconUrl     : (() => {
                                if (app.overwrites?.iconUrl) {
                                    return app.overwrites.iconUrl

                                } else {
                                    return getIconUrl(bookmark.val.url)
                                }
                            })(),

                            url: bookmark.val.url,
                        },

                        4: gridConf[4],
                        8: gridConf[8],
                    }

                    // Add grid item to temporary grid
                    tmpGrid.push(gridItem)
                }

                // Row correction
                current[4].row += Math.floor(appGroup.apps.length / 4)
                current[8].row += Math.floor(appGroup.apps.length / 8)

                if (Math.floor(appGroup.apps.length / 4) > 0
                    && appGroup.apps.length % 4 === 0
                ) {
                    current[4].row -= 1;
                }

                if (Math.floor(appGroup.apps.length / 8) > 0
                    && appGroup.apps.length % 8 === 0
                ) {
                    current[8].row -= 1;
                }
            }

            else if (homescreenItemType(entry) === 'divider') {
                // Type guard
                const divider = entry as Divider;

                // Create grid configuration
                const gridConf = {
                    4: gridHelp.item({
                        x: 0,
                        y: current[4].row,
                        w: 4,
                        h: 1,
                        resizable: false,
                        draggable: homescreen.editMode,
                        // fixed: !homescreen.editMode,
                    }) as SvelteGridProps,

                    8: gridHelp.item({
                        x: 0,
                        y: current[8].row,
                        w: 8,
                        h: 1,
                        resizable: false,
                        draggable: homescreen.editMode,
                        // fixed: !homescreen.editMode,
                    }) as SvelteGridProps,
                }

                // Create grid item
                const gridItem: GridItem = {
                    type        : 'divider',
                    id          : divider.id,
                    full        : divider,

                    4: gridConf[4],
                    8: gridConf[8],
                }

                // Add grid item to temporary grid
                tmpGrid.push(gridItem)

            }

            // Inc rows
            current[4].row += 1;
            current[8].row += 1;
        }

        // Update grid
        grid = tmpGrid;
    })

    // When grid changes, create temporary homescreen
    $effect(() => {
        // Copy grid
        const gridItems = [...grid]

        // Get current layout
        const layout = currentNumOfCols()

        // Sort items
        gridItems.sort((a, b) => {
            if (a[layout].y === b[layout].y) {
                return a[layout].x - b[layout].x
            }

            return a[layout].y - b[layout].y
        })

        // Temporary storage
        let tmpPageGrid: (AppGroup | Divider)[] = []
        let tmpAppGroup: AppGroup = { apps: [] }

        // Iterate items
        for (const item of gridItems) {
            if (item.type === 'app') {
                tmpAppGroup.apps.push(item.full)
            }

            else if (item.type === 'divider') {
                // Flush app group if filled
                if (tmpAppGroup.apps.length > 0) {
                    tmpPageGrid.push(tmpAppGroup)
                    tmpAppGroup = { apps: [] }
                }

                // Add divier
                tmpPageGrid.push(item.full)
            }
        }

        // Flush app group if filled
        if (tmpAppGroup.apps.length > 0) {
            tmpPageGrid.push(tmpAppGroup)
            tmpAppGroup = { apps: [] }
        }

        // Set temporary homescreen grid
        tmpHomescreenPageGrid = tmpPageGrid
    })

    $effect(() => {
        if (homescreen.pendingChange && !!tmpHomescreenPageGrid) {
            // Apply temporary homescreen page
            homescreen.currentPage.grid = tmpHomescreenPageGrid

            // Clear temporary homescreen page
            tmpHomescreenPageGrid = undefined

            // Mark change as processed
            homescreen.pendingChange = false;
        }
    })

    // Functions ///////////////////////////////////////////////////////////////
    function currentNumOfCols(): 4 | 8 {
        const w = window.innerWidth
        for (const c of cols) {
            const width = c[0]
            const cols = c[1]

            if (w <= width) { return cols as 4 | 8 }
        }

        return 8
    }

    ////////////////////////////////////////////////////////////////////////////
    // const id = () => "_" + Math.random().toString(36).substr(2, 9);
    // const cols = [
    //     [ 1200, 6 ],
    // ];

    // let items = $state([
    //     {
    //         6: gridHelp.item({
    //             x: 0,
    //             y: 0,
    //             w: 2,
    //             h: 2,
    //         }) as SvelteGridProps,
    //         id: id(),
    //     },

    //     {
    //         6: gridHelp.item({
    //             x: 2,
    //             y: 0,
    //             w: 2,
    //             h: 2,
    //         }) as SvelteGridProps,
    //         id: id(),
    //     },
    // ])

</script>

<!-- HTML ------------------------------------------------------------------ -->


<!-- <div class="w-full">
    <Grid bind:items={items} rowHeight={100} let:item let:dataItem {cols}>
        <div class="bg-slate-400 w-full h-full flex justify-center items-center">x{dataItem.id}</div>
    </Grid>
</div> -->

<div class="w-full">
    <Grid
        bind:items={grid}
        gap={[...grid].map(_ => 2)}
        let:dataItem
        cols={cols}
        rowHeight=104
        fastStart={true}
    >
        <div
            class="
                w-full h-full
                flex justify-center items-center
                relative
            "
        >
            {#if dataItem.type === 'app'}
                <AppComponent
                    id={dataItem.id}
                    title={dataItem.calculated.title}
                    url={dataItem.calculated.url}
                    iconUrl={dataItem.calculated.iconUrl}
                    onClick={() => {
                        if (homescreen.editMode === false) {
                            // window.open(dataItem.calculated.url, '_blank')
                        }
                    }}
                />

            {:else if dataItem.type === 'divider'}
                <DividerComponent
                    id={dataItem.id}
                    text={dataItem.full.title}
                />
            {/if}
        </div>
    </Grid>
</div>



<!-- ----------------------------------------------------------------------- -->
