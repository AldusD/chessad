import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

function SocketProvider({ children }) {
  const API = process.env.REACT_APP_API_BASE_URL;
  const socket = io(API);  

  return (
    <SocketContext.Provider value={ { socket } }>
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("Socket context not found");
  }
  return context;
}

export { useSocket, SocketProvider };
