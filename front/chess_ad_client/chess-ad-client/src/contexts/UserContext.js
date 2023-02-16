import { createContext, useContext, useState } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const API = 'http://localhost:5000';

  return (
    <UserContext.Provider value={{ API }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("user context not found");
  }
  return context;
}

export { useUser, UserProvider };
