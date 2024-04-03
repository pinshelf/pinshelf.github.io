# Project Setup
This file documents how the project in this repository was set up.

## Prerequisites
-   `pnpm`

## Init project
This project is a `pnpm` workspace. This means it does not only contain the
final web application but also libraries that the web app depends on.

-   `pnpm init`
-   `mkdir apps libs`
-   Create `pnpm-workspace.yaml` in the root of the repository.
    Copy-Paste the following content:
    ```yaml
    # ./pnpm-workspace.yaml
    packages:
        - 'apps/*'
        - 'libs/*'
    ```
-   Add development dependencies to the workspace:
    `pnpm install -D -w typescript @types/node rimraf`

-   Create `tsconfig.*.json` files
    -   `tsconfig.base.json` to define the base of all TS-configs
    -   `tsconfig.json` to provide a TS-config for the project root
        (this is needed for the TS language server)

-   Setup `prettier`:
    -   `pnpm install -D -w prettier` (installs prettier in the workspace)
    -   Create `.editorconfig`
    -   Create `.prettierrc.json` and `.prettierignore`

-   Setup `eslint`:
    -   `pnpm install -D -w eslint eslint-plugin-node @typescript-eslint/eslint-plugin @typescript-eslint/parser`
    -   Create `eslintrc.json`


## Create web application (SvelteKit)
-   `cd apps`
-   `pnpm create svelte@latest ui`  
    Chosen options:
    -   Which Svelte app template?: **Skeleton Project**
    -   Add type checking with TypeScript: **Yes, using TypeScript syntax**
    -   Select additional options:
        -   **Try the Svelte 5 preview (unstable!)**

    -   `cd ui; pnpm install`
        -   this emits a warning with the `svelte-hmr` peer dependency,
            because HMR is not yet supported in Svelte 5

-   Manually install the Svelte-Prettier Plugin:
    `pnpm install -D -w prettier-plugin-svelte`

    -   Add the following lines to `.pretierrc.json`:  
        ```json
        {
            ...,

            "plugins": ["prettier-plugin-svelte"],
            "overrides": [
                {
                    "files": "*.svelte",
                    "options": {
                        "parser": "svelte"
                    }
                }
            ],
            ...
        }
        ```

-   Install the static Adapter for hosting on GitHub Pages
    -   Make sure to be in `apps/ui` (otherwise `cd apps/ui`)
    -   `pnpm i -D @sveltejs/adapter-static`
    -   Add the following snippet to your `svelte.config.js`:
        ```js
        kit: {
            adapter: adapter({ fallback: '404.html' }),
        },
        ```

        Using `404.html` as fallback is special to GitHub Pages!


-   Setup `shadcn/ui` library
    -   Install `tailwind`
        -   Make sure to be in `apps/ui` (otherwise `cd apps/ui`)
        -   `pnpm i -D tailwindcss postcss autoprefixer`
        -   `pnpm exec tailwindcss init -p`
        -   Add `preprocess: vitePreprocess` to `svelte.config.json`
        -   Add `content: ['./src/**/*.{html,js,svelte,ts}'],` to
            `tailwind.config.js`
        -   Create `apps/ui/src/app.pcss`
        -   Make sure to `import '../app.pcss';` in your top level Svelte file

    -   Install `shadcn-svelte`:
        -   Make sure to be in `apps/ui` (otherwise `cd apps/ui`)
        -   `pnpx shadcn-svelte@latest init`  
            Chosen options:
            -   Would you like to use TypeScript: **Yes**
            -   Which style would you like to use: **New York**
            -   Which base color would you like to use: **Zinc**
            -   Where is your global CSS file: **`src/app.pcss`**
            -   Where is your Tailwind config located: **`tailwind.config.js`**
            -   Configure the import alias for components: **`$lib/components`**
            -   Configure the import alias for utils: **`$lib/utils`**


## How to create a library in `libs`
1.  `cd libs`
2.  `mkdir <lib_name>; cd <lib_name>`
3.  Create `src/index.ts`
4.  Create `package.json` with the following content:
    ```json
    {
        "name": "@libs/<lib_name>",
        "version": "0.0.1",
        "description": "",
        "main": "src/index.ts",
        "//main": "build/index.js",
        "//types": "build/index.d.ts",
        "scripts": {
            "build": "tsc",
            "clean:build": "rimraf build",
            "clean:nm": "rimraf node_modules"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "devDependencies": {}
    }
    ```
5.  Create `tsconfig.json` file for the library with the following content
    ```json
    {
        "extends": "../../tsconfig.base.json",
        "compilerOptions": {
            /* Projects */
            "target": "es2016",     /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */

            /* Modules */
            "module": "commonjs",   /* Specify what module code is generated. */
            "rootDir": "./src",     /* Specify the root folder within your source files. */

            /* Emit */
            "declaration": true,    /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
            "outDir": "./build"     /* Specify an output folder for all emitted files. */
        }
    }
    ```


