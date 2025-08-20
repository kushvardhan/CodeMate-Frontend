import { io } from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://localhost:4000", {
    transports: ["websocket", "polling"],
    timeout: 20000,
    forceNew: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    maxReconnectionAttempts: 5,
  });
};
