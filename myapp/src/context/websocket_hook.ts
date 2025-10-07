import { useContext } from "react";
import { WebSocketContext } from "./websocket_context_instance";
import { WebSocketContextType } from "./websocket_context_types";

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}