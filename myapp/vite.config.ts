import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: true,               // Listen on all network interfaces
    port: 8000,                // local dev port
    strictPort: true,
    allowedHosts: ["alorahs.tech"],
    hmr: {
      protocol: "wss",        // client will use secure WebSocket
      host: "alorahs.tech",   // public hostname (Cloudflare Tunnel)
      port: 8000,             // must match local Vite port
      clientPort: 443,        // client connects via WSS through tunnel
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
