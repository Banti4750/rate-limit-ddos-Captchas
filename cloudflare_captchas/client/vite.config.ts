import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external hosts
    allowedHosts: [
      "stravixglobaltech.com",
      "www.stravixglobaltech.com",
    ],
    port: 5173,
  },
});
