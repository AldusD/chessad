import { GameHallStyles, Game, SideBall, Label } from './styles';
import Guest from '../../../assets/guest.jpg';

export default function GameHall () {
    const gamesMock = [
      { user: 'AldusD', side: 'black', timeControl: [10, 5], profilePicture: '' }, 
      { user: 'MagnusKe7', side: 'white', timeControl: [10, 5], profilePicture: '' },
      { user: 'NakaCastle', side: 'random', timeControl: [10, 5], profilePicture: '' }
    ];

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

        {gamesMock ? 
          gamesMock.map((game, i) => 
            <Game key={`${game.user}${i}`} >
              <div>
                <img src={game.profilePicture || Guest} />
                <span>{game.user}</span>
              </div>
              <div>
                <span>{game.timeControl[0]} + {game.timeControl[1]}</span>
                <SideBall color={(game.side === 'random' ? '#000' : game.side)} color2={(game.side === 'random' ? '#FFF' : game.side)} />
              </div>
            </Game>)
        :
        <></>
        }
      </div>
    </GameHallStyles>
  )
}
