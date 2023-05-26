import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameContainer, GamePageStyles } from "../Game/styles";
import { PageStyle, Buttons, PovButton, ResetButton } from "../MainPage/styles";
import { GameControls, PgnContainer, MovePositionButton } from "./styles";
import Header from "../../Header";
import Guest from "../../../assets/guest.jpg"
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import { useGetGameByPath } from "../../../hooks/api/useGame";
import { useViewGame } from "../../../hooks/useViewGame";
import { useGame } from "../../../contexts/GameContext";

export default function ViewGamePage () {
  const gamePath = useParams().gamePath;
  const [pointOfView, setPointOfView] = useState('white');
  const [reset, setReset] = useState(false);
  const [pgn, setPgn] = useState([]);
  const [positions, setPositions] = useState([]);
  const [setPosition, setGameStatus, gameStatus, STATUS ] = useGame();
  const [gamePositions] = useViewGame();
  const [teams, setTeams] = useState(['white', 'black']);
  const {
    mutate: requestGameData,
    data: gameData 
  } = useGetGameByPath()

  const resetBoard = () => {
    setReset(!reset);
  }

  const changePov = (pov) => {
    setPointOfView(curr => pov);
    setTeams(curr => [pov, (pov === 'white') ? 'black' : 'white' ]);
  }

  useEffect(() => requestGameData(gamePath), [])

  useEffect(() => {
    if (!gameData || !gameData.game?.pgn) return;
    const whiteResult = gameData.game.result.split('-')[0];
    const result = (whiteResult === '1/2') ? STATUS.TIE : (whiteResult === '1') ? STATUS.WHITE : STATUS.BLACK;
    setGameStatus(curr => result);
    const pgnArr = gameData.game.pgn.split(", ");
    setPgn(curr => pgnArr);
  }, [gameData])

  return (
    <GamePageStyles>
      <Header />
      <PageStyle>
        <GameControls>
          <PgnContainer>
            {(!pgn) ? <></> : 
              pgn.map((moveString, i) => <div key={moveString + i} >{moveString}</div>)
            }
          </PgnContainer>
          <Buttons>
            <MovePositionButton onClick={resetBoard} rotation='0' />
            <MovePositionButton onClick={resetBoard} rotation='180' />
          </Buttons>
          <Buttons>
            {(pointOfView === 'white') ? 
              <PovButton onClick={() => changePov('black')} textColor={'#333'} backgroundColor={'white'} >POV: White</PovButton>
              : 
              <PovButton onClick={() => changePov('white')} textColor={'white'} backgroundColor={'#000'} >POV: Black</PovButton>
            }
            <ResetButton onClick={resetBoard} >Reset</ResetButton>
          </Buttons>
        </GameControls>
        <GameContainer>
          <Chessboard pointOfView={pointOfView} reset={reset} />
          <div className="data-container">
            {(!gameData || !gameData.game) ? <></> : 
              <><PlayerData 
                profilePicture={ gameData.game[`${teams[1]}Player`].profilePicture || Guest } 
                username={ gameData.game[`${teams[1]}Player`].username || 'Guest'} 
                color={pointOfView === "white" ? "black" : "white"} 
                showOptions={false} 
                pointOfView={pointOfView}
                initialTime={gameData.game.time} />
              <PlayerData 
                profilePicture={ gameData.game[`${teams[0]}Player`].profilePicture || Guest }
                username={ gameData.game[`${teams[0]}Player`].username || 'Guest'} 
                color={pointOfView} 
                showOptions={false}
                initialTime={gameData.game.time}
                pointOfView={pointOfView}
                isAnalysisBoard={false} /></>
            }
          </div>
        </GameContainer>
      </PageStyle>
    </GamePageStyles>
  )
}