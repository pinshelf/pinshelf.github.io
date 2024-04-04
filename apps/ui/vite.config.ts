import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Import package.json
import pkg from './package.json' assert { type: 'json' };


export default defineConfig({
	plugins: [sveltekit()],

	// Define values from package.json globally
    define: {
        // __PKG_NAME__: `"${pkg.name}"`,
        __PKG_VERSION__: `"${pkg.version}"`
    },
});
