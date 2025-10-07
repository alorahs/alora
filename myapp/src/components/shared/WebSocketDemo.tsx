import React, { useState } from "react";
import { useWebSocketHook } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WebSocketDemo: React.FC = () => {
  const { isConnected, emit, sendTyping, updateStatus, sendBookingUpdate } = useWebSocketHook();
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  const handleSendCustomMessage = () => {
    if (message) {
      const success = emit("customEvent", { message, timestamp: new Date() });
      if (success) {
        console.log("Message sent:", message);
        setMessage("");
      }
    }
  };

  const handleSendTyping = () => {
    if (userId) {
      sendTyping({ userId, isTyping: true });
      console.log("Typing indicator sent for user:", userId);
    }
  };

  const handleUpdateStatus = () => {
    updateStatus({ status: "available", timestamp: new Date() });
    console.log("Status update sent");
  };

  const handleSendBookingUpdate = () => {
    if (userId) {
      sendBookingUpdate({ 
        userId, 
        bookingId: "demo-booking-123",
        status: "confirmed",
        timestamp: new Date() 
      });
      console.log("Booking update sent for user:", userId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>WebSocket Demo</CardTitle>
        <CardDescription>
          Test real-time functionality with WebSocket events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h3 className="font-medium">Connection Status</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected to server" : "Disconnected"}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Send Custom Message</Label>
            <div className="flex gap-2">
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter message"
                disabled={!isConnected}
              />
              <Button 
                onClick={handleSendCustomMessage} 
                disabled={!isConnected || !message}
              >
                Send
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID for Events</Label>
            <div className="flex gap-2">
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user ID"
                disabled={!isConnected}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleSendTyping}
              disabled={!isConnected || !userId}
            >
              Send Typing Indicator
            </Button>
            <Button
              variant="outline"
              onClick={handleUpdateStatus}
              disabled={!isConnected}
            >
              Update Status
            </Button>
            <Button
              variant="outline"
              onClick={handleSendBookingUpdate}
              disabled={!isConnected || !userId}
            >
              Send Booking Update
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">How to use:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Ensure you're logged in to see connection status</li>
            <li>Enter a message and click "Send" to emit a custom event</li>
            <li>Enter a user ID to enable user-specific events</li>
            <li>Check browser console for event logs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebSocketDemo;