import { useWebSocket } from "@/context/websocket_context";

/**
 * Custom hook for WebSocket functionality
 * Provides easy access to socket connection and event emission
 */
export const useWebSocketHook = () => {
  const { socket, isConnected } = useWebSocket();

  /**
   * Emit a custom event to the server
   * @param event - The event name
   * @param data - The data to send
   */
  const emit = (event: string, data?: unknown) => {
    if (!isConnected || !socket) {
      console.warn("WebSocket is not connected, cannot emit event:", event);
      return false;
    }
    
    socket.emit(event, data);
    return true;
  };

  /**
   * Send a typing indicator event
   * @param data - Typing data (e.g., { userId: string, isTyping: boolean })
   */
  const sendTyping = (data: { userId: string; isTyping: boolean }) => {
    return emit("typing", data);
  };

  /**
   * Send a status update event
   * @param data - Status update data
   */
  const updateStatus = (data: unknown) => {
    return emit("updateStatus", data);
  };

  /**
   * Send a booking update event
   * @param data - Booking update data
   */
  const sendBookingUpdate = (data: unknown) => {
    return emit("bookingUpdate", data);
  };

  return {
    isConnected,
    emit,
    sendTyping,
    updateStatus,
    sendBookingUpdate,
  };
};