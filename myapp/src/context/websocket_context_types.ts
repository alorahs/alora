import { Socket } from "socket.io-client";

export interface WebSocketContextType {
  isConnected: boolean;
  socket: Socket | null;
}

export interface NotificationPayload {
  title: string;
  message: string;
  type: string;
  [key: string]: unknown;
}

export interface UserStatusPayload {
  userId: string;
  [key: string]: unknown;
}