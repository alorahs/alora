import { Server } from 'socket.io';

// Create a socket.io instance that can be shared across modules
let ioInstance = null;

export const initializeSocket = (server) => {
  if (ioInstance) {
    return ioInstance;
  }
  
  // Initialize Socket.IO
  ioInstance = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || ['http://localhost:8080','http://localhost:8081', 'http://localhost:8000', "http://10.244.78.2:8000", 'http://192.168.29.106:8000', 'http://192.168.29.162:8000','https://51090895-ce0d-4997-9b08-6afe46072bdb.lovableproject.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true
    }
  });
  
  // Store connected users globally so other modules can access them
  global.connectedUsers = new Map();
  
  // Handle WebSocket connections
  ioInstance.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // When a user connects, store their user ID
    socket.on('register', (userId) => {
      global.connectedUsers.set(userId, socket.id);
      console.log('User registered:', userId);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      // Remove user from connected users map
      for (let [userId, socketId] of global.connectedUsers.entries()) {
        if (socketId === socket.id) {
          global.connectedUsers.delete(userId);
          break;
        }
      }
    });
  });
  
  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return ioInstance;
};