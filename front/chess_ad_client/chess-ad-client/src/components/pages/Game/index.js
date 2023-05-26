import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GamePageStyles, GameContainer, GameResult } from "./styles";
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import Guest from "../../../assets/guest.jpg";
import Header from "../../Header";
import { useGetGameByPath, usePlayerToken, useFinishGame } from "../../../hooks/api/useGame";
import { useGame } from "../../../contexts/GameContext"; 
import { useUser } from "../../../contexts/UserContext";
import { useNewTokens } from "../../../hooks/api/useAuthentication";
import { useSocket } from "../../../contexts/SocketContext";

export default function Game () {
  const { userData } = useUser();
  const { gameSettings } = useGame();
  const { player, opponent, pointOfView,  } = gameSettings || '';
  const gamePath = useParams().gamePath;
  const [teams, setTeams] = useState(['white', 'black']);
  const [isGameClosed, setIsGameClosed] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { newMove, setNewMove, setPosition, setPlayersTimes, setExistDrawOffer, setGameStatus } = useGame();
  

  const {
    mutate: requestGameData,
    data: gameData
  } = useGetGameByPath();

  const {
    mutate: requestFinishGame,
    data: closedGameData,
  } = useFinishGame();
  
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
    socket.emit("join_game", { playerToken: localStorage.getItem('playerToken') });
    requestPlayerToken(gamePath);
  }, [])

  useEffect(() => {
    if (gameData && gameData.game) {
      if (gameData.game.blackPlayer.username == userData.username) setTeams(['black', 'white']);
    }

    if (gameData && gameData.game && !gameData.game.isOpen) {
      setIsGameClosed(curr => true);
      if (gameData.game.result === '1/2-1/2') {
        setGameResults(curr => ['Tied', '1/2-1/2'])
      } else {
        const result = gameData.game.result;
        const userWantedResult = (gameData.game.blackPlayer.username == userData.username) ? '0' : '1';
        const userResult = (result[0] === userWantedResult) ? 'Won' : 'Lost';  
        setGameResults(curr => [userResult, result]);
      }
      const status = (gameData.game.result === '1/2-1/2') ? 'tie' : (gameData.game.result === '1-0') ? 'white' : 'black';
      setGameStatus(curr => status);
    }
  }, [gameData])

  useEffect(() => {
    requestGameData(gamePath);
  }, [closedGameData]);

  useEffect(() => {
    if (newTokensData === 'refresh token expired or invalid') navigate('/');
    
    if (playerTokenData === 'invalid token') {
      requestTokens();
    }
  }, [newTokensData]);

  useEffect(() => {
    if (playerTokenData === 'invalid token') {
      return requestTokens();
    }
 
    if (localStorage.getItem('playerToken')) socket.emit("position", { playerToken: localStorage.getItem('playerToken') });
  }, [playerTokenData])

  useEffect(() => {
    if(!newMove) return;
    socket.emit("move_piece", { playerToken: localStorage.getItem('playerToken'), moveDetails: newMove })
  }, [newMove])

  useEffect(() => {
    socket.on("position", (positionData) => {
      if (isGameClosed) return;
      if (positionData.position) setPosition(JSON.parse(positionData.position));
      if (positionData.status?.whitePlayerTime && positionData.status?.blackPlayerTime && positionData.status?.turn ) setPlayersTimes(positionData.status);
    });

    socket.on("offer_draw", (message) => {
      if (isGameClosed) return;
      if (message === 'draw') setExistDrawOffer(true);
      if (message === 'canceled') setExistDrawOffer(false);
    })
    
    socket.on("game_result", (resultToken) => {
      if (!isGameClosed) {
        requestFinishGame(resultToken);
        setIsGameClosed(curr => true);
      }
    });

    socket.on("move_error", (error) => {
      if (isGameClosed) return;
      if (error === 'Player token invalid or expired') return requestPlayerToken(gamePath);
      return socket.emit("position", { playerToken: localStorage.getItem('playerToken') });
    });
  }, [socket])
        
  return (
    <GamePageStyles>
    <Header />
    <GameContainer>
    <Chessboard pointOfView={teams[0]} />
    { (gameData && gameData.game) ? 
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
        showOptions={false}
        initialTime={ gameData.game.time } />
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
        showOptions={true} 
        initialTime={ gameData.game.time } />
      </div> 
      :
      <></>
    }
    { (isGameClosed) ? 
      <GameResult>
        <span>You {gameResults[0]}</span>
        <span>{gameResults[1]}</span>
        <img src={userData.profilePicture || Guest} alt={userData.username} />
        <button onClick={() => navigate('/home')} >Go back</button>
      </GameResult>
      :
      <></>
    }
    </GameContainer>
    </GamePageStyles>
  )
}