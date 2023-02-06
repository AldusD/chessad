export function useMovePieces () {
  const validateMove = (coordI, coordF, pieces, usingSpell) => {
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const pieceType = (movingPiece.name[0] === 'p') ?  movingPiece.name.slice(2) : movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];
    
    // cannot capture same color piece + castle exception
    if (pieces[coordF] && pieces[coordF].color === color) {
      if(!(pieceType === 'King' && pieces[coordF].name.slice(1) === 'Rook')) return { error: true };
    }

    // cannot capture flying powerKnight
    const isPowerKnight = pieces[coordF]?.name.slice(2) === 'Knight';
    const isActive = pieces[coordF]?.active > pieces.move;
    if (isPowerKnight && isActive) return { error: true };

    // activating spell
    if (usingSpell) {
      const isPowerful = movingPiece.name[0] === 'p';
      const enoughXp = movingPiece.xp >= 5; 
      console.log(isPowerful, enoughXp, )
      if (!isPowerful || !enoughXp) return { error: true };
      pieces[coordI].active = pieces.move + 3;

      console.log(pieces[coordI])
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
          if (pieces[jumpPawn] && pieces[jumpPawn].jumpTime === pieces.move - 1) 
            return { valid: true, enPassant: jumpPawn }; 
          
          if (pieces[coordF])  
            return { valid: true };
          
          return false;
        }
        return { valid: true };
      };
      const promotionRule = () => {
        const backrankRule = coordF[0] === '1' && color === 'white' || coordF[0] === '8' && color === 'black';
        const noJumpsRule = Math.abs(numCoordF[0] - numCoordI[0]) === 1;
        if (backrankRule && noJumpsRule) return true;

        return false;
      }

      const passant = enPassantRule();
      if (captureRule() && passant.valid) {
        if (promotionRule()) return { specialMove: { name: 'promotion', coordI, numCoordI, coordF, numCoordF, pieces } };
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
      const castleRule = () => {
        // capture on same color rule includes an exception to allow castle  
        const myRookRule = pieces[coordF] && pieces[coordF].color === color; 
        const notMovedRule = myRookRule && !(movingPiece.hasMoved || pieces[coordF].hasMoved);
        if (!notMovedRule) return false;
        
        const CastleType = Math.abs(numCoordF[1] - numCoordI[1]) - 1;
        const step = Math.abs(numCoordF[1] - numCoordI[1]) /  (numCoordF[1] - numCoordI[1]);
        
        // verify 'free' path
        for (let i = 1; i <= CastleType; i++) { 
          const blockCoord = coordI[0] + (numCoordI[1] + i * step);
          if (pieces[blockCoord]) return false;
        };

        // verify safe path (TO BE IMPLEMENTED)

        return true;
      }

      if (castleRule()) return { specialMove: { 
          name: 'castle', coordI, numCoordI, coordF, numCoordF, pieces, 
          info: {
              direction: (numCoordF[1] > numCoordI[1]) ? 1 : -1
            } 
          } 
        };
      if (kingBoundaryRule) return true;
    }

    return { error: true };    
  }

  const handleSpecialMove = specialMove => {
    const { name, pieces, coordI, numCoordI, coordF, numCoordF } = specialMove;
    if (name === 'pawnJump') {
      pieces[coordI].jumpTime = pieces.move;
      return;
    }

    if (name === 'enPassant') {
      const { capturedPawnCoord } =  specialMove.info;
      pieces[capturedPawnCoord] = null;
      return;
    }

    if (name === 'promotion') {
      // (TO BE IMPLEMENTED) promotion to pieces other than queen 
      pieces[coordI].name = (coordF[0] === '1') ? 'wQueen' : 'bQueen';
      return;
    }

    if (name === 'castle') {
      const { direction } = specialMove.info;
      const kingCoordF = coordI[0] + (numCoordI[1] + 2 * direction);
      const rookCoordF = coordI[0] + (numCoordI[1] + 1 * direction);
      
      pieces[coordI].hasMoved = true;
      pieces[coordF].hasMoved = true;

      const kingState = movePiece(pieces, coordI, kingCoordF);
      const kingAndRookState = movePiece(kingState, coordF, rookCoordF);
      return { position: kingAndRookState };
    }
  } 

  const movePiece = (pieces, coordI, coordF) => {
    const currentState = {...pieces};
    const movingPiece = {...currentState[coordI]};
    currentState[coordI] = null;
    currentState[coordF] = movingPiece;
    return currentState
  }

  const evolve = (pieces, coord) => {
    if (pieces[coord].name[0] === 'p') return;
    const pieceType = pieces[coord].name.slice(1);
    const { name } = pieces[coord];

    if (pieceType === 'Knight') {
      pieces[coord].name = 'p' + name;
      pieces[coord].active = 0;
    }
  }

  const increaseXp = (pieces, coordI, coordF) => {
    const movingPiece = pieces[coordI];
    if (movingPiece.xp > 5) return;

    movingPiece.xp = movingPiece.xp + 1;
    if (pieces[coordF]) movingPiece.xp = movingPiece.xp + pieces[coordF].xp;
    if (movingPiece.xp >= 5 && movingPiece.name[0] !== 'p') evolve(pieces, coordI);
  }

  const changePositionStats = (pieces, coordI, coordF) => {
    pieces.move = pieces.move + 1;
    pieces[coordI].hasMoved = true;
    increaseXp(pieces, coordI, coordF);
  }

  const updatePosition = (coordI, coordF, pieces, specialMove = null) => {
    if (specialMove) {
      const action = handleSpecialMove(specialMove);
      if (action?.position) return action.position;
    }
    
    console.log(pieces[coordI])
    changePositionStats(pieces, coordI, coordF);
    const currentState = movePiece({...pieces}, coordI, coordF);
    return currentState;
  }
  return [
    validateMove,
    updatePosition
  ];
}
