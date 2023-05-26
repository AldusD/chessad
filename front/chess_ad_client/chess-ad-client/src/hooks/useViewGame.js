import { PIECES, PIECES_XP_BARRIER, COLORS } from "../components/ChessSet/enums";
import { useMovePieces } from "./useMovePieces";
import { useChessSet } from "./useChessSet";

export function useViewGame () {
  const [move] = useMovePieces();
  const [startPieces] = useChessSet();
  const initialPosition = startPieces();

  const extractMoveInfo = (move) => {
    const { moveString, moveNumber } = move;
    const coordI = moveString.slice(0, 2);
    const coordF= moveString.slice(3, 5);
    if (moveString[6] === 's') return { coordI, coordF, usingSpell: true, promote: false };
    if (moveString[6] === 'p') {
      const colorId = (moveNumber % 2 === 0) ? 'w' : 'b';
      if (moveString[8] === PIECES.QUEEN[0].toLowerCase()) return { coordI, coordF, usingSpell: false, promote: colorId + PIECES.QUEEN };
      if (moveString[8] === PIECES.KNIGHT[0].toLowerCase()) return { coordI, coordF, usingSpell: false, promote: colorId + PIECES.KNIGHT };
      if (moveString[8] === PIECES.ROOK[0].toLowerCase()) return { coordI, coordF, usingSpell: false, promote: colorId + PIECES.ROOK }; 
      if (moveString[8] === PIECES.BISHOP[0].toLowerCase()) return { coordI, coordF, usingSpell: false, promote: colorId + PIECES.BISHOP };
    }
    return { coordI, coordF, usingSpell: false, promote: false };
  }
  
  const gamePositions = (pgnArr) => {
    const positionsArr = [];
    let pieces = initialPosition;

    for (let i = 0; i < pgnArr.length; i++) {
      const moveInfo = extractMoveInfo({ moveString: pgnArr[i], moveNumber: i });
      const newPosition = move({ ...moveInfo, pieces });
      if (newPosition.error) return positionsArr;
      pieces = newPosition.position;
      positionsArr.push(JSON.stringify(pieces));
    }
    return positionsArr;
  }

  return [gamePositions];
}
