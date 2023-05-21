import { useEffect, useState } from "react";
import { ResignButton, OfferDrawButton, DrawOfferResponses, Options } from "./styles";
import { useGame } from "../../contexts/GameContext";
import { useSocket } from "../../contexts/SocketContext";

export default function GameOptions ({ isAnalysisBoard, color }) {
  const { setGameStatus, STATUS } = useGame();
  const { socket } = useSocket();
  const { existDrawOffer, setExistDrawOffer } = useGame();

  const resign = () => {
    const opponentColor = (color === "white") ? "black" : "white";
    setGameStatus(opponentColor);
    socket.emit("resign", { playerToken: localStorage.getItem("playerToken") });
  }

  const proposeTie = () => {
    if (isAnalysisBoard) setGameStatus(STATUS.TIE);
    socket.emit("offer_draw", { playerToken: localStorage.getItem("playerToken") });
  }

  return (
      <>
      {existDrawOffer ?
        <DrawOfferResponses>
          <span>Draw offer:</span>
          <div>
            <span onClick={proposeTie} >Draw</span>
            <span onClick={() => setExistDrawOffer(false)} >Game!</span>
          </div>
        </DrawOfferResponses> 
        :
        <Options>
          <ResignButton onClick={resign} />
          <OfferDrawButton onClick={proposeTie} />
        </Options>
      }
      </>
    );
}
