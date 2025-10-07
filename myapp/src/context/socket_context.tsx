// Compatibility layer for socket_context.tsx
// This file exists to prevent import errors from legacy code
// All new code should use websocket_context.tsx instead
/* eslint-disable react-refresh/only-export-components */

export { useWebSocket as useSocket } from "./websocket_context";
export { WebSocketProvider as SocketProvider } from "./websocket_context";