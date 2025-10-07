import { createContext } from "react";
import { WebSocketContextType } from "./websocket_context_types";

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);