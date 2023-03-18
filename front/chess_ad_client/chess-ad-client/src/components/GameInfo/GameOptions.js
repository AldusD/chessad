import { ResignButton, OfferDrawButton } from "./styles";
import { useGame } from "../../contexts/GameContext";

export default function GameOptions ({ isAnalysisBoard, color }) {
  const { setGameStatus, STATUS } = useGame();
  
  const resign = () => {
    const opponentColor = (color === "white") ? "black" : "white";
    setGameStatus(opponentColor);
  }

  const proposeTie = () => {
    if (isAnalysisBoard) setGameStatus(STATUS.TIE);
  }

  return (
      <div>
        <ResignButton onClick={resign} />
        <OfferDrawButton onClick={proposeTie} />
      </div>
    );
}
