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
  const [newMove, setNewMove] = useState([]);
  const [position, setPosition] = useState({});
  const [playersTimes, setPlayersTimes] = useState({});
  const [moveNumber, setMoveNumber] = useState(0);
  const [existDrawOffer, setExistDrawOffer] = useState(false);

  const clearGameStats = () => {
    setGameStatus(STATUS.ONGOING);
    setGameSettings({});
    setNewMove([]);
    setPosition({});
    setPlayersTimes({});
    setMoveNumber(0);
    setExistDrawOffer(false);
  }

  return (
    <GameContext.Provider value={{ 
      gameStatus, setGameStatus, 
      gameSettings, setGameSettings, 
      newMove, setNewMove, 
      position, setPosition,
      playersTimes, setPlayersTimes,
      moveNumber, setMoveNumber,
      existDrawOffer, setExistDrawOffer,
      STATUS, clearGameStats }}>
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
