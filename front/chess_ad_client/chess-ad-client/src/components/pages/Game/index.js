import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GamePageStyles, GameContainer } from "./styles";
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import Guest from "../../../assets/guest.jpg";
import Header from "../../Header";
import { useGame } from "../../../contexts/GameContext"; 
import { useGetGameByPath } from "../../../hooks/api/useGame";
import { usePlayerToken } from "../../../hooks/api/useGame";
import { useUser } from "../../../contexts/UserContext";
import { useNewTokens } from "../../../hooks/api/useAuthentication";

export default function Game () {
  const { userData } = useUser();
  const { gameSettings } = useGame();
  const { player, opponent, pointOfView,  } = gameSettings || '';
  const gamePath = useParams().gamePath;
  const [teams, setTeams] = useState(['white', 'black']);
  const navigate = useNavigate();

  const {
    mutate: requestGameData,
    data: gameData
  } = useGetGameByPath();
  
  const {
    mutate: requestPlayerToken,
    data: playerTokenData
  } = usePlayerToken();

  const {
    mutate: requestTokens,
    data: newTokensData
  } = useNewTokens();

  useEffect(() => {
    requestGameData(gamePath);
  }, [])

  useEffect(() => {
    if (gameData && gameData.game) {
      if (gameData.game.blackPlayer.username == userData.username) setTeams(['black', 'white']);
    }
    console.log(`${teams[0]}Player`)
    console.log(`${teams[1]}Player`)
  }, [gameData])

  useEffect(() => {
    if (newTokensData === 'refresh token expired or invalid') navigate('/');
    
    if (playerTokenData === 'invalid token') {
      requestPlayerToken(gamePath);
    }
  }, [newTokensData]);
        
  return (
    <GamePageStyles>
    <Header />
    <GameContainer>
    <Chessboard pointOfView={pointOfView} />
    <div className="data-container">
      <PlayerData 
        profilePicture={ (gameData && gameData.game[`${teams[1]}Player`].profilePicture) ? 
          gameData.game[`${teams[1]}Player`].profilePicture 
          : 
          Guest 
        } 
        username={ (gameData && gameData.game[`${teams[1]}Player`]) ? 
          gameData.game[`${teams[1]}Player`].username 
          : 
          Guest 
        } 
        color={teams[1]} 
        showOptions={false} />
      <PlayerData 
        profilePicture={ (gameData && gameData.game[`${teams[0]}Player`].profilePicture) ?  
          gameData.game[`${teams[0]}Player`].profilePicture 
          : 
          Guest 
        }
        username={ (gameData && gameData.game[`${teams[0]}Player`]) ? 
          gameData.game[`${teams[0]}Player`].username 
          : 
          Guest 
        } 
        color={teams[0]} 
        showOptions={true} />
    </div>
    </GameContainer>
    </GamePageStyles>
  )
}