import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useToast } from '@/components/ui/use-toast';

interface Notification {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

const WebSocketExample: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [token, setToken] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Clean up socket connection on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const connect = () => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'Please enter a JWT token',
        variant: 'destructive',
      });
      return;
    }

    // Disconnect existing connection if any
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Connect to Socket.IO server
    socketRef.current = io({
      auth: {
        token: token,
      },
    });

    // Connection events
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      toast({
        title: 'Connected',
        description: `Connected to server with ID: ${socketRef.current?.id}`,
      });
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: 'Disconnected',
        description: 'Disconnected from server',
      });
    });

    socketRef.current.on('connect_error', (error) => {
      toast({
        title: 'Connection Error',
        description: error.message,
        variant: 'destructive',
      });
    });

    // Notification event
    socketRef.current.on('newNotification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      toast({
        title: notification.title,
        description: notification.message,
      });
    });

    // User status events
    socketRef.current.on('userOnline', (data: { userId: string }) => {
      toast({
        title: 'User Online',
        description: `User ${data.userId} is now online`,
      });
    });

    socketRef.current.on('userOffline', (data: { userId: string }) => {
      toast({
        title: 'User Offline',
        description: `User ${data.userId} is now offline`,
      });
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setIsConnected(false);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">WebSocket Real-time Notifications</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Connection</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your JWT token"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={connect}
            disabled={isConnected}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Connect
          </button>
          <button
            onClick={disconnect}
            disabled={!isConnected}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Disconnect
          </button>
        </div>
        <div className="mt-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className={`mr-2 h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button
            onClick={clearNotifications}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear All
          </button>
        </div>
        
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications yet. Connect to the server and trigger some events.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-md border-l-4 ${
                  notification.type === 'success' ? 'border-green-500 bg-green-50' :
                  notification.type === 'error' ? 'border-red-500 bg-red-50' :
                  notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">{notification.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{notification.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSocketExample;