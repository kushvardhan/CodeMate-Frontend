import { io } from "socket.io-client";

// Singleton socket instance to prevent multiple connections
let socketInstance = null;

export const createSocketConnection = () => {
  // Return existing connection if available and connected
  if (socketInstance && socketInstance.connected) {
    return socketInstance;
  }

  // Create new connection if none exists or previous one is disconnected
  socketInstance = io("https://code-mate-backend-topaz.vercel.app/", {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5,
    autoConnect: true,
  });

  // Add connection event listeners for debugging
  socketInstance.on("connect", () => {
    console.log("Socket connected:", socketInstance.id);
  });

  socketInstance.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socketInstance.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socketInstance;
};

// Function to get existing socket instance
export const getSocketInstance = () => {
  return socketInstance;
};

// Function to disconnect socket
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
