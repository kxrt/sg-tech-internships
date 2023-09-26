import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://backend:8000",
//         // target: "http://localhost:8000", // development
//         changeOrigin: true,
//       },
//     },
//   },
// });

export default defineConfig(({ command, mode }) => {
    if (command === "serve") {
        return {
            plugins: [react()],
            server: {
                proxy: {
                    "/api": {
                        target:
                            mode === "dev"
                                ? "http://backend:8000"
                                : "http://localhost:8080",
                        // target: "http://localhost:8000", // development
                        changeOrigin: true,
                    },
                },
            },
        };
    } else {
        // command === 'build'
        return {
            plugins: [react()],
            server: {
                proxy: {
                    "/api": {
                        target: "http://backend:8000",
                        // target: "http://localhost:8000", // development
                        changeOrigin: true,
                    },
                },
            },
        };
    }
});
