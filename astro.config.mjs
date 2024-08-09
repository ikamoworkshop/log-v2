import glsl from 'vite-plugin-glsl';
import { defineConfig } from 'astro/config';

import sanity from "@sanity/astro";

// https://astro.build/config
export default defineConfig({
vite: {
    plugins: [
        glsl()
    ]
},
    integrations: [
        sanity({
            projectId: "z49s437i",
            dataset: "production",
            useCdn: false,
        })
    ]
});