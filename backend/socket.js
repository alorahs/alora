import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/user.js';

// Store connected users in a Map (userId -> socketId)
global.connectedUsers = global.connectedUsers || new Map();

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance
 */
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || ['http://localhost:8081', 'http://10.97.115.2:8081', 'http://localhost:8000', 'https://alorahs.app', "http://192.168.31.147:8081"],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Register user with their socket ID
    global.connectedUsers.set(socket.userId, socket.id);
    
    // Notify other users that this user is online
    socket.broadcast.emit('userOnline', { userId: socket.userId });
    
    // Handle user registration (associate userId with socketId)
    socket.on('register', (userId) => {
      if (socket.userId === userId) {
        global.connectedUsers.set(userId, socket.id);
        console.log(`User registered: ${userId} with socket ${socket.id}`);
      }
    });
    
    // Handle user status update
    socket.on('updateStatus', (data) => {
      // Broadcast status update to all connected users
      socket.broadcast.emit('statusUpdated', data);
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      socket.broadcast.emit('userTyping', data);
    });
    
    // Handle booking updates
    socket.on('bookingUpdate', (data) => {
      // Send booking update to specific user
      const targetSocketId = global.connectedUsers.get(data.userId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('bookingUpdated', data);
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      
      // Remove user from connected users map
      global.connectedUsers.delete(socket.userId);
      
      // Notify other users that this user is offline
      socket.broadcast.emit('userOffline', { userId: socket.userId });
    });
  });

  // Store io instance globally for access from other modules
  global.io = io;
  
  return io;
};

/**
 * Get IO instance
 * @returns {Server} Socket.IO server instance
 */
export const getIO = () => {
  if (!global.io) {
    throw new Error('Socket.IO not initialized!');
  }
  return global.io;
};

/**
 * Send notification to a specific user
 * @param {string} userId - User ID to send notification to
 * @param {Object} notification - Notification object
 */
export const sendNotificationToUser = (userId, notification) => {
  if (!global.io) {
    console.warn('Socket.IO not initialized, cannot send notification');
    return;
  }
  
  const socketId = global.connectedUsers.get(userId.toString());
  if (socketId) {
    global.io.to(socketId).emit('newNotification', notification);
  }
};

/**
 * Send notification to all connected users
 * @param {Object} notification - Notification object
 */
export const broadcastNotification = (notification) => {
  if (!global.io) {
    console.warn('Socket.IO not initialized, cannot broadcast notification');
    return;
  }
  
  global.io.emit('newNotification', notification);
};

/**
 * Check if a user is online
 * @param {string} userId - User ID to check
 * @returns {boolean} Whether user is online
 */
export const isUserOnline = (userId) => {
  return global.connectedUsers.has(userId.toString());
};

export default { initializeSocket, getIO, sendNotificationToUser, broadcastNotification, isUserOnline };