import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameContainer, GamePageStyles } from "../Game/styles";
import { PageStyle, Buttons, PovButton, ResetButton } from "../MainPage/styles";
import { GameControls, PgnContainer } from "./styles";
import Header from "../../Header";
import Guest from "../../../assets/guest.jpg"
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import { useGetGameByPath } from "../../../hooks/api/useGame";
import { useGame } from "../../../contexts/GameContext";


export default function ViewGamePage () {
  const [pointOfView, setPointOfView] = useState('white');
  const [reset, setReset] = useState(false);
  const { setPosition, setGameStatus, STATUS } = useGame();
  const [pgn, setPgn] = useState([]);
  const gamePath = useParams().gamePath;
    
  const {
    mutate: requestGameData,
    data: gameData 
  } = useGetGameByPath()

  const resetBoard = () => {
    setReset(!reset);
    setGameStatus(STATUS.ONGOING);
  }

  useEffect(() => requestGameData(gamePath), [])
  useEffect(() => {
    console.log('idx33', gameData)
    if (!gameData || !gameData.game?.pgn) return;
    const pgnArr = gameData.game.pgn.split(", ");
    console.log(pgnArr);
    setPgn(curr => pgnArr);
  }, [gameData])

  return (
    <GamePageStyles>
      <Header />
      <PageStyle>
        <GameControls>
          <PgnContainer>
            {(!pgn) ? <></> : 
              pgn.map(moveString => <div>{moveString}</div>)
            }
          </PgnContainer>
          <Buttons>
            {(pointOfView === 'white') ? 
              <PovButton onClick={() => setPointOfView('black')} textColor={'#333'} backgroundColor={'white'} >POV: White</PovButton>
              : 
              <PovButton onClick={() => setPointOfView('white')} textColor={'white'} backgroundColor={'#333'} >POV: Black</PovButton>
            }
            <ResetButton onClick={resetBoard} >Reset</ResetButton>
          </Buttons>
        </GameControls>
        <GameContainer>
          <Chessboard pointOfView={pointOfView} reset={reset} />
          <div className="data-container">
            <PlayerData 
              profilePicture={Guest} 
              username={'Guest'} 
              color={pointOfView === "white" ? "black" : "white"} 
              showOptions={false} />
            <PlayerData 
              profilePicture={Guest}
              username={'Guest'} 
              color={pointOfView} 
              showOptions={true}
              isAnalysisBoard={true} />
          </div>
        </GameContainer>
      </PageStyle>
    </GamePageStyles>
  )
}