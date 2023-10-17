import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
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
    preview: {
        port: 5173,
        strictPort: true,
        host: "0.0.0.0",
    },
});
