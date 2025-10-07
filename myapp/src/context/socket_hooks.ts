import { useWebSocket, WebSocketProvider } from "./websocket_context";

export const useSocket = useWebSocket;
export { WebSocketProvider as SocketProvider } from "./websocket_context";