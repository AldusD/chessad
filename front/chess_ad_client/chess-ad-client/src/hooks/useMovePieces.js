export function useMovePieces () {
  const validateMove = (coordI, coordF, pieces) => {
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const pieceType = movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];
    console.log(numCoordI, numCoordF)
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
      if(captureRule() && (moveOneFowardRule || moveTwoFowardRule)) {
        return true
      }
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
