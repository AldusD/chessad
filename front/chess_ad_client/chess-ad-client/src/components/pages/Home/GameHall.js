import { Link } from 'react-router-dom';
import { GameHallStyles, Game, SideBall, Label } from './styles';
import Guest from '../../../assets/guest.jpg';
import { useGetGames } from '../../../hooks/api/useGameSetting';

export default function GameHall () {
  const {
    data: gamesData,
    isError,
    isLoading,
    isFetching
  } = useGetGames();

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
            gamesData.games.map((game, i) => 
              <Link to={`/games/join/${game.path}`} >
                <Game key={`${game.user.username}${i}`} >
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
              </Link>)
          :
          <></>
          }
          <p></p>
        </div>
      </div>
    </GameHallStyles>
  )
}
