import { SquareStyle, SelectedFilter } from "./styles";
import { useMovePieces } from "../../hooks/useMovePieces";
import Piece from "./Piece";
import { useGame } from "../../contexts/GameContext";

export default function Square ({ coordinates, color, pieces, setPieces, selectedSquare, setSelectedSquare, usingSpell, setUsingSpell, refresh }) {
  const [move] = useMovePieces(); 
  const { setGameStatus, STATUS } = useGame();
  
  const movePiece = () => {
    const moveInfo = move({ 
      coordI: selectedSquare, 
      coordF: coordinates, 
      pieces,
      usingSpell
    });
    if(moveInfo.error) return setSelectedSquare(coordinates);
    
    setPieces(moveInfo.position);
    setUsingSpell(false);
    if(moveInfo.checkmate) {
      console.log('checkmate');
      setGameStatus(STATUS[moveInfo.checkmate]);
    }
    refresh.set(!refresh.value);
    return setSelectedSquare(null);
    }
    
  const selectSquare = () => {
    const previousPiece = pieces[selectedSquare];
    if(coordinates === selectedSquare) return setSelectedSquare(null);
      
    if (previousPiece) {
      return movePiece();
    }      
    setSelectedSquare(coordinates);
    }
    
    return (
        <SquareStyle 
          onClick={() => selectSquare()} 
          isSelected={selectedSquare === coordinates}
          color={color} >

          {(selectedSquare === coordinates) ? <SelectedFilter /> : <></>}
          {(pieces && pieces[coordinates]) ? 
            <Piece
              pieceInfo={{...pieces[coordinates]}} 
              move={pieces.move} 
              refresh={refresh} />
            :
            <></>    
          }
        </SquareStyle>
    )
}
