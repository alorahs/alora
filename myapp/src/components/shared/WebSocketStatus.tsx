import React from "react";
import { useWebSocket } from "@/context/websocket_context";

const WebSocketStatus: React.FC = () => {
  const { isConnected } = useWebSocket();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-full shadow-lg">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Live</span>
      </div>
    </div>
  );
};

export default WebSocketStatus;