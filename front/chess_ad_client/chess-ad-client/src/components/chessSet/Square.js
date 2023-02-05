import styled from "styled-components";
import { useMovePieces } from "../../hooks/useMovePieces";
import Piece from "./Piece";

export default function Square ({ coordinates, color, pieces, setPieces, selectedSquare, setSelectedSquare }) {
  const [validateMove, updatePosition] = useMovePieces(); 
  
  const movePiece = () => {
    if(!validateMove(selectedSquare, coordinates, pieces)) return setSelectedSquare(coordinates);
    const newPosition = updatePosition(selectedSquare, coordinates, pieces);
    setPieces(newPosition);
    setSelectedSquare(null);
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
          {pieces[coordinates] ? 
            <Piece name={pieces[coordinates].name} color={pieces[coordinates].color} />
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