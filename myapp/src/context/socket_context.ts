// Compatibility layer for socket_context
// This file exists to prevent import errors from legacy code
// All new code should use websocket_context.tsx instead

export { useWebSocket as useSocket } from "./websocket_context";