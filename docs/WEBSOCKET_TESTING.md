# WebSocket Implementation Testing Guide

This guide explains how to test the WebSocket implementation in the Alora application.

## Prerequisites

1. Backend server running (`npm start` in `alora/backend`)
2. Valid JWT token for authentication
3. Frontend application running (optional, for UI testing)

## Testing Methods

### 1. Using the Built-in HTML Example

1. Start the backend server:
   ```bash
   cd alora/backend
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5000/socket-example.html
   ```

3. Enter a valid JWT token and click "Connect"

4. Test notifications using the API endpoints described below

### 2. Using the React Component

1. Start the frontend application:
   ```bash
   cd alora/myapp
   npm run dev
   ```

2. Navigate to the WebSocket example page (you may need to add a route for it)

3. Enter your JWT token and connect

### 3. Using API Endpoints

#### Get a JWT Token

First, log in to get a JWT token:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "identifier": "your_email@example.com",
    "password": "your_password"
  }'
```

#### Broadcast Notification to All Users

```bash
curl -X POST http://localhost:5000/api/socket-test/broadcast \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "title": "Test Broadcast",
    "message": "This is a test broadcast message",
    "type": "info"
  }'
```

#### Send Notification to Specific User

```bash
curl -X POST http://localhost:5000/api/socket-test/send/USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_API_KEY" \
  -d '{
    "title": "Direct Message",
    "message": "This is a direct message",
    "type": "info"
  }'
```

#### Get Socket Statistics

```bash
curl -X GET http://localhost:5000/api/socket-test/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "apikey: YOUR_API_KEY"
```

## Testing Scenarios

### Scenario 1: Basic Connection

1. Connect to the WebSocket server with a valid token
2. Verify connection status changes to "Connected"
3. Check server logs for connection message

### Scenario 2: Receiving Notifications

1. Connect to WebSocket server
2. Use the broadcast API endpoint to send a notification
3. Verify the notification appears in the client UI
4. Check that a toast notification is shown

### Scenario 3: User Presence

1. Connect with one user
2. Connect with another user
3. Verify both users receive "userOnline" events
4. Disconnect one user
5. Verify the other user receives "userOffline" event

### Scenario 4: Direct Messaging

1. Get the user ID of a connected user
2. Use the send API endpoint to send a direct message
3. Verify only the target user receives the notification

### Scenario 5: Authentication Failure

1. Try to connect with an invalid token
2. Verify connection is rejected
3. Check that appropriate error message is displayed

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure the backend server is running on port 5000
2. **Authentication Failed**: Verify the JWT token is valid and not expired
3. **CORS Errors**: Check that the client domain is in the CORS configuration
4. **Events Not Received**: Ensure the user is properly registered with their user ID

### Debugging Tips

1. Check server logs for connection and disconnection events
2. Use browser developer tools to inspect WebSocket frames
3. Verify the global.connectedUsers Map is being populated correctly
4. Check that the correct socket ID is being used for direct messaging

## Integration with Existing Features

The WebSocket implementation is already integrated with:

1. **Booking System**: Notifications are sent when bookings are created or status changes
2. **Notification Model**: Real-time notifications are sent alongside database storage
3. **User Authentication**: JWT tokens are used for secure connections

To test these integrations:

1. Create a new booking through the API
2. Verify that the professional receives a real-time notification
3. Update the booking status
4. Verify that the user receives a real-time notification about the status change

## Performance Testing

For load testing:

1. Connect multiple clients simultaneously
2. Send broadcast messages to all connected users
3. Monitor server resource usage
4. Check for any connection drops or message losses

## Security Testing

1. Attempt to connect without a token (should fail)
2. Attempt to connect with an invalid token (should fail)
3. Attempt to send messages without proper authentication
4. Verify that users can only receive messages intended for them