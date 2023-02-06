import styled from "styled-components";
import { useMovePieces } from "../../hooks/useMovePieces";
import Piece from "./Piece";

export default function Square ({ coordinates, color, pieces, setPieces, selectedSquare, setSelectedSquare, usingSpell, setUsingSpell }) {
  const [validateMove, updatePosition] = useMovePieces(); 
  
  const movePiece = (usingSpell) => {
    const moveInfo = validateMove(selectedSquare, coordinates, pieces, usingSpell);
    if(moveInfo.error) return setSelectedSquare(coordinates);
    const newPosition = updatePosition(selectedSquare, coordinates, pieces, moveInfo.specialMove);
    setPieces(newPosition);
    setUsingSpell(false);
    return setSelectedSquare(null);
    }
    
  const selectSquare = () => {
    const previousPiece = pieces[selectedSquare];
    if(coordinates === selectedSquare) return setSelectedSquare(null);
      
    if (previousPiece) {
      return movePiece(usingSpell);
    }      
    setSelectedSquare(coordinates);
    }
    
    return (
        <SquareStyle 
          onClick={() => selectSquare()} 
          isSelected={selectedSquare === coordinates}
          color={color} >

          {(selectedSquare === coordinates) ? <SelectedFilter /> : <></>}
          {pieces[coordinates] ? 
            <Piece
              pieceInfo={{...pieces[coordinates]}} 
              move={pieces.move} />
            :
            <></>    
          }
        </SquareStyle>
    )
}

const SquareStyle = styled.div`
    background-color: ${props => props.color};
    height: 10vh;
    width: 10vh;
    position: relative;

    span {
        font-size: 0.6rem;
    }
`;

const SelectedFilter = styled.div`
  position: absolute;
  height: 10vh;
  width: 10vh;
  background-color: #fe670080;
`;