// vite.config.ts
import { defineConfig } from "file:///E:/project/alora/myapp/node_modules/vite/dist/node/index.js";
import react from "file:///E:/project/alora/myapp/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///E:/project/alora/myapp/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "E:\\project\\alora\\myapp";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: true,
    // Listen on all network interfaces
    port: 8e3,
    // local dev port
    strictPort: true
    // allowedHosts: ["alorahs.tech"],
    // hmr: {
    //   protocol: "wss",        // client will use secure WebSocket
    //   host: "alorahs.tech",   // public hostname (Cloudflare Tunnel)
    //   port: 8000,             // must match local Vite port
    //   clientPort: 443,        // client connects via WSS through tunnel
    // },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@/shared": path.resolve(__vite_injected_original_dirname, "./src/shared"),
      "@/features": path.resolve(__vite_injected_original_dirname, "./src/features"),
      "@/components": path.resolve(__vite_injected_original_dirname, "./src/components"),
      "@/pages": path.resolve(__vite_injected_original_dirname, "./src/pages"),
      "@/hooks": path.resolve(__vite_injected_original_dirname, "./src/hooks"),
      "@/lib": path.resolve(__vite_injected_original_dirname, "./src/lib")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxwcm9qZWN0XFxcXGFsb3JhXFxcXG15YXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxwcm9qZWN0XFxcXGFsb3JhXFxcXG15YXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9wcm9qZWN0L2Fsb3JhL215YXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSwgICAgICAgICAgICAgICAvLyBMaXN0ZW4gb24gYWxsIG5ldHdvcmsgaW50ZXJmYWNlc1xyXG4gICAgcG9ydDogODAwMCwgICAgICAgICAgICAgICAgLy8gbG9jYWwgZGV2IHBvcnRcclxuICAgIHN0cmljdFBvcnQ6IHRydWUsXHJcbiAgICAvLyBhbGxvd2VkSG9zdHM6IFtcImFsb3JhaHMudGVjaFwiXSxcclxuICAgIFxyXG4gICAgLy8gaG1yOiB7XHJcbiAgICAvLyAgIHByb3RvY29sOiBcIndzc1wiLCAgICAgICAgLy8gY2xpZW50IHdpbGwgdXNlIHNlY3VyZSBXZWJTb2NrZXRcclxuICAgIC8vICAgaG9zdDogXCJhbG9yYWhzLnRlY2hcIiwgICAvLyBwdWJsaWMgaG9zdG5hbWUgKENsb3VkZmxhcmUgVHVubmVsKVxyXG4gICAgLy8gICBwb3J0OiA4MDAwLCAgICAgICAgICAgICAvLyBtdXN0IG1hdGNoIGxvY2FsIFZpdGUgcG9ydFxyXG4gICAgLy8gICBjbGllbnRQb3J0OiA0NDMsICAgICAgICAvLyBjbGllbnQgY29ubmVjdHMgdmlhIFdTUyB0aHJvdWdoIHR1bm5lbFxyXG4gICAgLy8gfSxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCldLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgICAgXCJAL3NoYXJlZFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3NoYXJlZFwiKSxcclxuICAgICAgXCJAL2ZlYXR1cmVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvZmVhdHVyZXNcIiksXHJcbiAgICAgIFwiQC9jb21wb25lbnRzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvY29tcG9uZW50c1wiKSxcclxuICAgICAgXCJAL3BhZ2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvcGFnZXNcIiksXHJcbiAgICAgIFwiQC9ob29rc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL2hvb2tzXCIpLFxyXG4gICAgICBcIkAvbGliXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbGliXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFAsU0FBUyxvQkFBb0I7QUFDelIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQVNkO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsaUJBQWlCLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDOUUsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3BDLFlBQVksS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNsRCxjQUFjLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0I7QUFBQSxNQUN0RCxnQkFBZ0IsS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQzFELFdBQVcsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUNoRCxXQUFXLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDaEQsU0FBUyxLQUFLLFFBQVEsa0NBQVcsV0FBVztBQUFBLElBQzlDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
