import { createContext, useContext, useState } from "react";

const GameContext = createContext();
const STATUS = Object.freeze({
  ONGOING: "ongoing",
  BLACK: "black",
  WHITE: "white",
  TIE: 'tie'  
});

function GameProvider({ children }) {
  const [gameStatus, setGameStatus] = useState(STATUS.ONGOING);
  const [gameSettings, setGameSettings] = useState({});

  return (
    <GameContext.Provider value={{ gameStatus, setGameStatus, STATUS, gameSettings, setGameSettings }}>
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("game context not found");
  }
  return context;
}

export { useGame, GameProvider };
