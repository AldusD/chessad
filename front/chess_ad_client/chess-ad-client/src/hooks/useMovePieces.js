export function useMovePieces () {
  const validateMove = (coordI, coordF, pieces) => {
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const pieceType = movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];

    if (pieces[coordF] && pieces[coordF].color === color) { // cannot capture same color piece
      return { error: true };
    }

    if (pieceType === 'Pawn') {
      const moveOneFowardRule = (numCoordI[0] === numCoordF[0] + 1) && color === 'white' || (numCoordI[0] === numCoordF[0] - 1) && color === 'black'; 
      const moveTwoFowardRule = (numCoordI[0] === numCoordF[0] + 2) && color === 'white' && numCoordI[0] === 7 ||  (numCoordI[0] === numCoordF[0] - 2) && color === 'black' && numCoordI[0] === 2;
      const captureRule = () => {
        if(numCoordI[1] === numCoordF[1]) {
          if (Math.abs(numCoordI[0] - numCoordF[0]) === 1 && !pieces[coordF]) return true;
          if (Math.abs(numCoordI[0] - numCoordF[0]) === 2 && !pieces[coordF]) 
            if ((!pieces[(numCoordI[0] - 1) + coordI[1]] && color === 'white') || !pieces[(numCoordI[0] + 1) + coordI[1]] && color === 'black') return true;
        }

        if (Math.abs(numCoordI[1] - numCoordF[1]) === 1)
          if ((color === 'white' && numCoordI[0] === numCoordF[0] + 1) || (color === 'black' && numCoordI[0] === numCoordF[0] - 1))  return true;

        return false;
      };
      const enPassantRule = () => {
        const jumpPawn = (color === 'white') ? (numCoordF[0] + 1) + coordF[1] : (numCoordF[0] - 1) + coordF[1];
        if (Math.abs(numCoordI[1] - numCoordF[1]) === 1) {
          if (pieces[jumpPawn] && pieces[jumpPawn].jumpTime === pieces.move - 1) return { valid: true, enPassant: jumpPawn }; 
          if (pieces[coordF]) return { valid: true };
          return false;
        }
        return { valid: true };
      };
      const promotionRule = () => {
        if (coordF[0] === 1 && color === 'white' || coordF[0] === 8 && color === 'black') {
          return false // to be implemented :)
        }
        return false;
      }


      const passant = enPassantRule();
      if (captureRule() && passant.valid) {
        if (passant.enPassant) return { specialMove: { name: 'enPassant', coordI, numCoordI, coordF, numCoordF, pieces, info: { capturedPawnCoord: passant.enPassant } } }; 
        if (moveOneFowardRule) return true;
        if (moveTwoFowardRule) return { specialMove: { name: 'pawnJump', coordI, numCoordI, coordF, numCoordF, pieces } }
      };
      return { error: true };
    }

    if (pieceType === 'Knight') {
      const yMove = numCoordF[0] - numCoordI[0];
      const xMove = numCoordF[1] - numCoordI[1];
      const lShapeRule = (Math.abs(xMove) === 2 && Math.abs(yMove) === 1) || (Math.abs(yMove) === 2 && Math.abs(xMove) === 1);

      if (lShapeRule) return true;
    }

    const bishopObstacleRule = (xMove, yMove) => {
      const xStep = (xMove > 0) ? 1 : -1;
      const yStep = (yMove > 0) ? 1 : -1;
      
      let blockCoord = [numCoordI[0] + yStep, numCoordI[1] + xStep];
      while (blockCoord[0] !== numCoordF[0]) {
        if(pieces[blockCoord[0].toString() + blockCoord[1].toString()]) return false;
        blockCoord[0] = blockCoord[0] + yStep;
        blockCoord[1] = blockCoord[1] + xStep;
      }
      return true;
    }
    if (pieceType === 'Bishop') {
      const yMove = numCoordF[0] - numCoordI[0];
      const xMove = numCoordF[1] - numCoordI[1];
      
      const diagonalRule = (xMove === yMove) || (xMove === -yMove);
      const obstacleRule = bishopObstacleRule(xMove, yMove);

      if(diagonalRule && obstacleRule) return true;
      return { error: true };
    }

    const rookObstacleRule = () => {
      let step;
      let direction;
      if (numCoordF[0] - numCoordI[0] !== 0) {
        step = (numCoordF[0] - numCoordI[0]) / Math.abs(numCoordF[0] - numCoordI[0]);
        direction = 0;
      } else {
          step =  (numCoordF[1] - numCoordI[1]) / Math.abs(numCoordF[1] - numCoordI[1]);
          direction = 1;
      }

      const blockCoord = [...numCoordI];
      blockCoord[direction] = blockCoord[direction] + step;

      while (blockCoord[direction] !== numCoordF[direction]) {
        if(pieces[blockCoord[0].toString() + blockCoord[1].toString()]) return false;
        blockCoord[direction] = blockCoord[direction] + step;
      }
      return true;
    }
    if (pieceType === 'Rook') {
      const crossRule = (numCoordF[0] - numCoordI[0] === 0 || numCoordF[1] - numCoordI[1] === 0);
      const obstacleRule = rookObstacleRule();

      if (crossRule && obstacleRule) return true;
      return { error: true };
    }

    if (pieceType === 'Queen') {
      const yMove = numCoordF[0] - numCoordI[0];
      const xMove = numCoordF[1] - numCoordI[1];
      
      const crossRule = (xMove === 0 || yMove === 0);
      const diagonalRule = (xMove === yMove) || (xMove === -yMove);
    
      if ((crossRule && rookObstacleRule() || diagonalRule && bishopObstacleRule(xMove, yMove))) return true;
    }

    if (pieceType === 'King') {
      const yMove = numCoordF[0] - numCoordI[0];
      const xMove = numCoordF[1] - numCoordI[1];
      const kingBoundaryRule = (Math.abs(xMove) <= 1 && Math.abs(yMove) <= 1);
    
      if (kingBoundaryRule) return true;
    }

    return { error: true };    
  }

  const handleSpecialMove = specialMove => {
    const { pieces, coordI, numCoordI, coordF, numCoordF } = specialMove;
    if (specialMove.name === 'pawnJump') {
      pieces[coordI].jumpTime = pieces.move;
    }

    if (specialMove.name === 'enPassant') {
      const { capturedPawnCoord } =  specialMove.info;
      pieces[capturedPawnCoord] = null;
    }
  } 

  const updatePosition = (coordI, coordF, pieces, specialMove = null) => {
    if (specialMove) handleSpecialMove(specialMove);
    
    pieces.move = pieces.move + 1;
    const currentState = {...pieces};
    const movingPiece = {...currentState[coordI]};
    currentState[coordI] = null;
    currentState[coordF] = movingPiece;

    return currentState;
  }
  return [
    validateMove,
    updatePosition
  ];
}
