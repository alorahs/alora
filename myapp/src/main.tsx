import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/auth_provider.ts";
import { NotificationProvider } from "./context/notification_context.ts";
import { SocketProvider } from "./context/socket_context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  </StrictMode>
);
