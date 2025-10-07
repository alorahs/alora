# WebSocket Implementation Documentation

## Overview

This document explains the WebSocket implementation in the Alora application using Socket.IO. The implementation provides real-time communication capabilities for features like notifications, user presence tracking, and live updates.

## Architecture

The WebSocket implementation consists of:

1. **Socket Configuration** - `backend/socket.js`
2. **Server Integration** - `backend/server.js`
3. **Client Connection** - Frontend applications
4. **Event Handling** - Real-time features

## Socket Configuration (`backend/socket.js`)

The socket configuration file handles:

- Socket.IO server initialization
- Authentication middleware
- Connection management
- Event handling
- Utility functions

### Key Features

1. **Authentication**: JWT token verification for secure connections
2. **User Tracking**: Global Map to track connected users (userId → socketId)
3. **Event Broadcasting**: Send messages to specific users or all connected users
4. **Presence Detection**: Track online/offline status of users

### Available Events

#### Server to Client Events

- `newNotification` - New notification for the user
- `userOnline` - A user has come online
- `userOffline` - A user has gone offline
- `statusUpdated` - User status has been updated
- `userTyping` - User is typing (for chat features)
- `bookingUpdated` - Booking status has changed

#### Client to Server Events

- `register` - Register user with their socket ID
- `updateStatus` - Update user status
- `typing` - Indicate user is typing
- `bookingUpdate` - Send booking update

## Server Integration

The Socket.IO server is initialized in `server.js`:

```javascript
import { initializeSocket } from './socket.js';
const server = createServer(app);
const io = initializeSocket(server);
```

## Client Connection

Frontend applications connect using the Socket.IO client:

```javascript
import { io } from 'socket.io-client';

const socket = io({
  auth: {
    token: 'JWT_TOKEN_HERE'
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newNotification', (notification) => {
  console.log('New notification:', notification);
});
```

## API Endpoints for Testing

### Broadcast Notification to All Users

```
POST /api/socket-test/broadcast
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Test Broadcast",
  "message": "This is a test broadcast message",
  "type": "info"
}
```

### Send Notification to Specific User

```
POST /api/socket-test/send/:userId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Direct Message",
  "message": "This is a direct message",
  "type": "info"
}
```

### Get Socket Statistics

```
GET /api/socket-test/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

## Integration with Notification System

The notification system automatically sends real-time notifications when:

1. A new booking is created
2. Booking status changes
3. New reviews are added
4. Admin announcements are made

The `createNotification` function in `notification_route.js` uses the WebSocket implementation:

```javascript
// Emit real-time notification via WebSocket if user is connected
const io = getIO();
const socketId = global.connectedUsers?.get(userId.toString());
if (socketId) {
  io.to(socketId).emit('newNotification', fullNotification);
}
```

## User Presence Tracking

The system tracks user online/offline status:

- When a user connects, `userOnline` is broadcast to other users
- When a user disconnects, `userOffline` is broadcast to other users
- Connected users are stored in a global Map for quick lookup

## Security

- All connections require a valid JWT token
- Tokens are verified using the same secret as the REST API
- CORS is configured to match the application's domain settings

## Error Handling

- Connection errors are logged server-side
- Client-side connection errors are emitted as `connect_error` events
- Authentication failures prevent socket connections

## Testing

To test the WebSocket implementation:

1. Start the server: `npm start` in the backend directory
2. Open `http://localhost:5000/socket-example.html` in your browser
3. Enter a valid JWT token and click "Connect"
4. Use the API endpoints to send test notifications

## Extending the Implementation

To add new real-time features:

1. Add new event handlers in `socket.js`
2. Emit events from your route handlers using `getIO()`
3. Listen for events in your frontend application

Example of emitting a custom event:

```javascript
import { getIO } from '../socket.js';

// In your route handler
const io = getIO();
io.emit('customEvent', { data: 'example' });
```

## Performance Considerations

- The global Map for connected users is efficient for small to medium user bases
- For larger applications, consider using Redis for distributed socket management
- Event payloads should be kept small to minimize bandwidth usage
- Disconnect events are handled automatically to prevent memory leaks

## Troubleshooting

Common issues and solutions:

1. **Connection failures**: Verify JWT token is valid and not expired
2. **Events not received**: Check that the user is connected and registered
3. **CORS errors**: Ensure client domain is in the CORS configuration
4. **Authentication errors**: Verify JWT_SECRET matches between authentication and socket modules

## Future Enhancements

Potential improvements:

1. **Scalability**: Implement Redis adapter for multi-server deployments
2. **Rooms**: Use Socket.IO rooms for group messaging features
3. **Rate Limiting**: Add rate limiting for socket events
4. **Logging**: Enhanced logging for debugging and monitoring