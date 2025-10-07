# WebSocket Integration Guide

This document explains how to use the WebSocket implementation in the Alora frontend application.

## Overview

The WebSocket implementation provides real-time communication capabilities using Socket.IO. It's integrated with the existing authentication and notification systems to provide seamless real-time updates.

## Architecture

The implementation consists of:

1. **WebSocket Context** - Manages the Socket.IO connection
2. **Notification Integration** - Automatically refreshes notifications when new ones arrive
3. **Toast Notifications** - Shows desktop-style notifications for real-time events
4. **Connection Status** - Visual indicator of WebSocket connection status

## How It Works

1. When a user logs in, the WebSocket context automatically connects to the server
2. The connection is authenticated using the same JWT token as the REST API
3. When real-time notifications arrive, they automatically refresh the notification list
4. Toast notifications are displayed for immediate user feedback

## Using WebSocket in Components

### Basic Usage

To use WebSocket functionality in your components:

```typescript
import { useWebSocketHook } from "@/hooks/useWebSocket";

const MyComponent = () => {
  const { isConnected, emit } = useWebSocketHook();
  
  const sendMessage = () => {
    emit("customEvent", { message: "Hello server!" });
  };
  
  return (
    <div>
      <p>WebSocket Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <button onClick={sendMessage} disabled={!isConnected}>
        Send Message
      </button>
    </div>
  );
};
```

### Pre-built Functions

The hook provides several pre-built functions for common use cases:

```typescript
import { useWebSocketHook } from "@/hooks/useWebSocket";

const MyComponent = () => {
  const { 
    isConnected, 
    sendTyping, 
    updateStatus, 
    sendBookingUpdate 
  } = useWebSocketHook();
  
  // Send typing indicator
  const handleTyping = () => {
    sendTyping({ userId: "123", isTyping: true });
  };
  
  // Update user status
  const handleStatusUpdate = () => {
    updateStatus({ status: "available" });
  };
  
  // Send booking update
  const handleBookingUpdate = () => {
    sendBookingUpdate({ 
      bookingId: "456", 
      status: "confirmed" 
    });
  };
};
```

## Available Events

### Incoming Events (Server to Client)

- `newNotification` - New notification received
- `userOnline` - A user has come online
- `userOffline` - A user has gone offline
- `statusUpdated` - User status has been updated
- `userTyping` - User is typing (for chat features)
- `bookingUpdated` - Booking status has changed

### Outgoing Events (Client to Server)

- `register` - Register user with their socket ID (automatic)
- `typing` - Indicate user is typing
- `updateStatus` - Update user status
- `bookingUpdate` - Send booking update

## Connection Management

The WebSocket connection is automatically managed:

1. **Connect**: When user logs in and has a valid JWT token
2. **Disconnect**: When user logs out or token expires
3. **Reconnect**: Automatically attempts to reconnect if connection is lost

## Error Handling

The implementation includes error handling for:

- Connection failures
- Authentication errors
- Network issues
- Server errors

Errors are displayed as toast notifications to the user.

## Testing the Implementation

To test the WebSocket implementation:

1. Start the backend server
2. Log in to the application
3. Observe the "Live" indicator in the bottom right corner
4. Trigger a notification through the API or backend
5. Verify that the notification appears immediately

## Extending the Implementation

To add new real-time features:

1. Add new event handlers in the WebSocket context
2. Emit events from your components using the hook
3. Handle events on the server side

Example of adding a new event handler:

```typescript
// In websocket_context.tsx
socketRef.current.on("customEvent", (data) => {
  console.log("Custom event received:", data);
  // Handle the event
});
```

## Troubleshooting

Common issues and solutions:

1. **Not connecting**: Verify JWT token is valid and not expired
2. **Events not received**: Check that the user is properly registered
3. **Connection drops**: Check network connectivity and server status
4. **Authentication errors**: Verify token is correctly extracted from cookies

## Performance Considerations

- The connection is only established for authenticated users
- Events are automatically cleaned up when components unmount
- Reconnection attempts are limited to prevent excessive resource usage
- Large payloads should be avoided to minimize bandwidth usage

## Security

- All connections are authenticated with JWT tokens
- Same security measures as the REST API
- CORS is properly configured
- Token extraction from secure cookies