import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GameHallStyles, Game, SideBall, Label } from './styles';
import Guest from '../../../assets/guest.jpg';
import { useGetGames } from '../../../hooks/api/useGameSetting';
import { useJoinGame } from '../../../hooks/api/useGame';
import { useNewTokens } from '../../../hooks/api/useAuthentication';

export default function GameHall () {
  const [joiningPath, setJoiningPath] = useState();
  const [joiningGame, setJoiningGame] = useState();
  
  const {
    mutate: requestTokens,
    data: newTokensData
  } = useNewTokens();

  const {
    data: gamesData,
    isLoading: loadingGames,
    isFetching
  } = useGetGames();

  const {
    data: joinGameData,
    isLoading: loadingJoin,
    mutate: requestJoinGame
  } = useJoinGame();

  const navigate = useNavigate();

  const joinGame = (game) => {
    const { path } = game;
    if (!path) return;
    setJoiningGame(game);
    setJoiningPath(path);
    return requestJoinGame(path);
  };

  useEffect(() => {
    if (joinGameData === 'invalid token') {
      return requestTokens();
    }

    if(joinGameData && joinGameData[0] === '{') {
      return navigate(`/games/play/${joiningPath}/`);
    }
  }, [joinGameData])

  useEffect(() => {
    if (newTokensData === 'refresh token expired or invalid') navigate('/');
    
    if (joinGameData === 'invalid token') {
      requestJoinGame(joiningPath);
    }
  }, [newTokensData])


  return (
    <GameHallStyles>
      <h2>Join a game!</h2>
      <div>
        <Label>
          <span>User</span>
          <div>
            <span>Time</span>
            <span>Side</span>
          </div>
        </Label>
        <div className='games-container'>
          {gamesData ? 
            gamesData.games?.map((game, i) => 
                <Game onClick={() => joinGame(game)}  key={`${game.user.username}${i}`} >
                  <div>
                    <img src={game.profilePicture || Guest} />
                    <span>{game.user.username}</span>
                  </div>
                  <div>
                    <span>{game.time} + {game.increment}</span>
                    <SideBall 
                      color={(game.side === 'random' ? '#000' : game.side === 'white' ? 'black' : 'white')} 
                      color2={(game.side === 'random' ? '#FFF' : game.side === 'white' ? 'black' : 'white')} />
                  </div>
                </Game>
              )
          :
          <></>
          }
          <p></p>
        </div>
      </div>
    </GameHallStyles>
  )
}
