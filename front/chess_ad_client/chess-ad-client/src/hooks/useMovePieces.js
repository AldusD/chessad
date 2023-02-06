export function useMovePieces () {
  const validateMove = (coordI, coordF, pieces) => {
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const pieceType = movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];

    if (pieces[coordF] && pieces[coordF].color === color) { // cannot capture same color piece
      return false;
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
          if (pieces[coordF] && (color === 'white' && numCoordI[0] === numCoordF[0] + 1) || (color === 'black' && numCoordI[0] === numCoordF[0] - 1))
            return true;


        return false;
      };

      if(captureRule() && (moveOneFowardRule || moveTwoFowardRule)) return true;
      return false;
    }

    if (pieceType === 'Bishop') {
      const yMove = numCoordF[0] - numCoordI[0];
      const xMove = numCoordF[1] - numCoordI[1];
      
      const diagonalRule = (xMove === yMove) || (xMove === -yMove);
      const obstacleRule = () => {
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

      if(diagonalRule && obstacleRule()) return true;
      return false;
    }

    if (pieceType === 'Rook') {
      const crossRule = (numCoordF[0] - numCoordI[0] === 0 || numCoordF[1] - numCoordI[1] === 0);
      
      const obstacleRule = () => {
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

      if (crossRule && obstacleRule()) return true;
      return false;
    }

    return false;    
  }

  const updatePosition = (coordI, coordF, pieces) => {
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
