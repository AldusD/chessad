import { useState } from "react";

import { SquareStyle, SelectedFilter } from "./styles";
import { useMovePieces } from "../../hooks/useMovePieces";
import Piece from "./Piece";
import { useGame } from "../../contexts/GameContext";
import PromotionModal from "./PromotionModal";

export default function Square (props) {
  const { coordinates, color, pieces, setPieces, selectedSquare, setSelectedSquare, usingSpell, setUsingSpell, promotion, setPromotion, refresh, pointOfView } = props;
  const [move] = useMovePieces();
  const [showPromotionModal, setShowPromotionModal] = useState(promotion[0] === coordinates);
  const { setGameStatus, STATUS, setNewMove, setMoveNumber } = useGame();
  
  const movePiece = info => {
    setPromotion((curr) => [false, '']);
    
    const moveInfo = move({ 
      coordI: info.selectedSquare, 
      coordF: info.coordinates, 
      pieces: {...info.pieces},
      usingSpell: info.usingSpell,
      promote: info.promote
    });
    
    if(!moveInfo.error) {
      setPieces(moveInfo.position);
      setNewMove({ move: [info.selectedSquare, info.coordinates], usingSpell: info.usingSpell, promote: info.promote });
      setMoveNumber((curr) => curr + 1);
      setUsingSpell(false);
      if(moveInfo.checkmate) setGameStatus(STATUS[moveInfo.checkmate]);
      refresh.set(!refresh.value);
      return setSelectedSquare(null);
      
    } else {
      setPromotion((curr) => false, '');
      return setSelectedSquare(coordinates);
    }
  }
    
  const selectSquare = () => {
    const previousPiece = pieces[selectedSquare];
    if(coordinates === selectedSquare) return setSelectedSquare(null);
      
    if (previousPiece) {
      const promotionRank = coordinates[0] === ((previousPiece.color === 'white') ? '1' : '8');
      const isPawn = previousPiece.name.includes('Pawn');
      const yourTurn = (previousPiece.color === 'white') ? !(pieces.move % 2 === 0) : (pieces.move % 2 === 0); 
      if (promotionRank && isPawn && yourTurn) {
        setPromotion([coordinates, '']);
        return;
      }
      return movePiece({ selectedSquare, coordinates, pieces: {...pieces}, usingSpell, pointOfView });
    }  

    setSelectedSquare(coordinates);
  }
    
  return (
      <SquareStyle 
        onClick={() => selectSquare()}
        onBlur={() => setPromotion([false, ''])}
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
        {(promotion[0] === coordinates) ? 
          <PromotionModal 
            color={(pieces.move % 2 === 0) ? 'black' : 'white'} 
            setPromotion={setPromotion} 
            movePiece={movePiece}
            selectedSquare={selectedSquare}
            coordinates={coordinates}
            position={pieces} 
            usingSpell={usingSpell} 
            pointOfView={pointOfView} /> 
          : 
          <></>
        }
      </SquareStyle>
  )
}
