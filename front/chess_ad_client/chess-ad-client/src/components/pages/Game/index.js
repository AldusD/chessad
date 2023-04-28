import { GamePageStyles, GameContainer } from "./styles";
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import Guest from "../../../assets/guest.jpg";
import Header from "../../Header";
import { useGame } from "../../../contexts/GameContext"; 

export default function Game () {
    const { gameSettings } = useGame();
    const { player, opponent, pointOfView,  } = gameSettings || '';
    console.log('gs', gameSettings);
        
    return (
        <GamePageStyles>
        <Header />
        <GameContainer>
        <Chessboard pointOfView={pointOfView} />
        <div className="data-container">
          <PlayerData 
            profilePicture={ opponent?.profilePicture || Guest } 
            username={ opponent?.username || 'Guest'} 
            color={pointOfView === "white" ? "black" : "white"} 
            showOptions={false} />
          <PlayerData 
            profilePicture={ player?.profilePicture || Guest }
            username={ player?.username || 'Guest' } 
            color={pointOfView} 
            showOptions={true} />
        </div>
      </GameContainer>
      </GamePageStyles>
    )
}