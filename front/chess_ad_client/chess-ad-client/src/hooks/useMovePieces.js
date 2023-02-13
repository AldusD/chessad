const PIECES_XP_BARRIER = { KNIGHT: 5, BISHOP: 5, ROOK: 7, QUEEN: 10 };

export function useMovePieces () {
  const move = (moveInfo) => {
    const moveDetails = validateMove({...moveInfo});
    if (moveDetails.error) return { error: true };
    if (moveDetails.abortUpdate) return { position: moveDetails.pieces };

    changePositionStats(moveDetails);
    const position = updatePosition(moveDetails);
    return { position };
  }
  
  const validatePawn = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color } = moveInfo;
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
        if (pieces[jumpPawn] && pieces[jumpPawn].jumpTime === pieces.move){
          return { valid: true, enPassant: jumpPawn };} 
          
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

  const validateKnight = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color } = moveInfo;
    const yMove = numCoordF[0] - numCoordI[0];
    const xMove = numCoordF[1] - numCoordI[1];
    const lShapeRule = (Math.abs(xMove) === 2 && Math.abs(yMove) === 1) || (Math.abs(yMove) === 2 && Math.abs(xMove) === 1);

    if (lShapeRule) {
      pieces[coordI].active = 0;
      return { pieces };
    };

    return { error: true };
  }

  const validateBishop = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color, bishopObstacleRule } = moveInfo;
    const yMove = numCoordF[0] - numCoordI[0];
    const xMove = numCoordF[1] - numCoordI[1];
    
    const diagonalRule = (xMove === yMove) || (xMove === -yMove);
    const obstacleRule = bishopObstacleRule(xMove, yMove);

    if(diagonalRule && obstacleRule) return true;
    return { error: true };
  }

  const validateRook = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color, rookObstacleRule } = moveInfo;
    const crossRule = (numCoordF[0] - numCoordI[0] === 0 || numCoordF[1] - numCoordI[1] === 0);
    const obstacleRule = rookObstacleRule();

    if (crossRule && obstacleRule) return true;
    return { error: true };
  }

  const validateQueen = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color, rookObstacleRule, bishopObstacleRule } = moveInfo;
    const yMove = numCoordF[0] - numCoordI[0];
    const xMove = numCoordF[1] - numCoordI[1];
      
    const crossRule = (xMove === 0 || yMove === 0);
    const diagonalRule = (xMove === yMove) || (xMove === -yMove);
    
    if ((crossRule && rookObstacleRule() || diagonalRule && bishopObstacleRule(xMove, yMove))) return true;
    return { error: true };
  }

  const validateKing = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color, movingPiece } = moveInfo;
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
    return { error: true };
  }

  const validateZombie = moveInfo => {
    const { coordI, coordF, numCoordI, numCoordF, pieces, color, movingPiece } = moveInfo;
    const direction = (color === 'white') ? -1 : 1;
    const oneFowardRule = (numCoordF[0] - numCoordI[0]) === direction;
    const boundaryRule = Math.abs(numCoordF[1] - numCoordI[1]) <= 1;
    const notRottenRule = movingPiece.active > pieces.move;
    
    if (oneFowardRule && boundaryRule && notRottenRule) return true;
    return { error: true };
  }

  const validateSpellEffects = moveInfo => {
    const { coordF, pieces } = moveInfo;
    const isPowerKnight = pieces[coordF]?.name.slice(2) === 'Knight';
    const isBrokenTile = pieces[coordF]?.name.slice(1) === 'Broken';
    const isActive = pieces[coordF]?.active > pieces.move;
    
    if (isActive && (isPowerKnight || isBrokenTile)) return { error: true };
    return { error: false };
  }

  const killInvisiblePiece = moveInfo => {
    const { coordF, pieces } = moveInfo;
    const visiblePieces = {...pieces};
    const isSpellPiece = pieces[coordF]?.name.slice(1) === 'Broken' || pieces[coordF]?.name.slice(1) === 'Zombie'; 
    const isActive = pieces[coordF]?.active > pieces.move;
    if (isSpellPiece && !isActive) visiblePieces[coordF] = null;
    return visiblePieces; 
  }

  const validateMove = (moveInfo) => {
    const { coordI, coordF, pieces, usingSpell } = moveInfo;
    const details = { data: { coordI, coordF, pieces, specialMove: false } };
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const pieceType = (movingPiece.name[0] === 'p') ?  movingPiece.name.slice(2) : movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];
    const info = { 
      coordI, coordF,
      numCoordI, numCoordF, 
      pieces, color, 
      movingPiece, pieceType, 
      movingPiece };

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

    if (pieces[coordF]) {
      const visiblePieces = killInvisiblePiece(moveInfo);
      pieces[coordF] = visiblePieces[coordF];
    }

    // cannot capture same color piece + exceptions
    if (pieces[coordF] && pieces[coordF].color === color) {
      const destinationType = pieces[coordF].name.slice(1);
      const castleException = (pieceType === 'King' && destinationType === 'Rook');
      if (!castleException) return { error: true };
    }

    // spell effects
    const spellEffects = validateSpellEffects({...info});
    if (spellEffects.error) return { error: true };

    // pieces movement constraints
    if (pieceType === 'Broken') return { error: true };
    if (pieceType === 'Pawn') details.data = { ...details.data , ...validatePawn({...info}) };
    if (pieceType === 'Knight') details.data = { ...details.data , ...validateKnight({...info}) };
    if (pieceType === 'Bishop') details.data = { ...details.data , ...validateBishop({ ...info, bishopObstacleRule }) };
    if (pieceType === 'Rook') details.data = { ...details.data , ...validateRook({ ...info, rookObstacleRule }) };
    if (pieceType === 'Queen') details.data = { ...details.data , ...validateQueen({ ...info, bishopObstacleRule, rookObstacleRule }) };  
    if (pieceType === 'King') details.data = { ...details.data , ...validateKing({...info}) };
    if (pieceType === 'Zombie') details.data = {...details.data, ...validateZombie({...info})};
    if (details.data.error) return details.data;
    
    // activating spell
    if (usingSpell) {
      const spell = handleSpell({ pieces, pieceType, coordF, coordI });
      if (spell.error) return { error: true };
      details.data.abortUpdate = spell.abortUpdate;
      details.data.pieces = spell.pieces; 
    }

    return details.data;    
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
      pieces[coordI].xp = 0;
      pieces[coordI].xpBarrier = 10;
      return;
    }

    if (name === 'castle') {
      const { direction } = specialMove.info;
      const kingCoordF = coordI[0] + (numCoordI[1] + 2 * direction);
      const rookCoordF = coordI[0] + (numCoordI[1] + 1 * direction);
      
      pieces[coordI].hasMoved = true;
      pieces[coordF].hasMoved = true;

      const kingState = movePiece({ pieces, coordI, kingCoordF });
      const kingAndRookState = movePiece({ kingState, coordF, rookCoordF });
      return { position: kingAndRookState };
    }
  }

  const handleSpell = spellData => {
    const { pieces, pieceType, coordI, coordF } = spellData;
    const piece = pieces[coordI];
    const xpBarrier = PIECES_XP_BARRIER[pieceType.toUpperCase()];
    const enoughXp = piece.xp >= xpBarrier;
    const isPowerful = piece.name[0] === 'p';

    if (!isPowerful || !enoughXp) return { error: true }; 
    pieces[coordI].xp = -1;

    if (pieceType === 'Knight') {
      pieces[coordI].active = pieces.move + 5;
      return { pieces };
    }

    if (pieceType === 'Bishop') {
      changePositionStats({ pieces, coordI, coordF });
      const bishop = pieces[coordI]
      pieces[coordF] = bishop;
      pieces[coordI] = {
        name: bishop.color[0] + 'Zombie',
        color: bishop.color,
        active: (pieces.move - 1) + 4,
        xp: 0
      };
      return { abortUpdate: true, pieces };
    }

    if (pieceType === 'Rook') {
      changePositionStats({ pieces, coordI, coordF });
      pieces[coordI].xp = 0;
      pieces[coordF] = {
        name: 'sBroken',
        color: 'none',
        active: (pieces.move - 1) + 4,
        xp: 0
      };
      return { abortUpdate: true, pieces };
    }

    if (pieceType === 'Queen') {
      const queen = pieces[coordI];
      const isPieceValid = piece => piece[1]?.name.includes('Knight') || piece[1]?.name.includes('Bishop') || piece[1]?.name.includes('Rook');  
      const affectedPieces = Object.entries(pieces).filter(piece => (piece[1]?.color === queen.color && isPieceValid(piece)));
      for (let i = 0; i < affectedPieces.length; i++) {
        const p = affectedPieces[i];
        pieces[p[0]].xp = pieces[p[0]].xpBarrier; 
      }

      return { pieces };
    }

    return { error: false };
  }

  const movePiece = (moveDetails) => {
    const { pieces, coordI, coordF } = moveDetails;
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
    pieces[coord].name = 'p' + name;
    pieces[coord].active = 0;
  }

  const increaseXp = moveDetails => {
    const { pieces, coordI, coordF } = moveDetails;
    const movingPiece = pieces[coordI];
    const type = movingPiece.name.slice(1);
    const xpBarrier = movingPiece.xpBarrier;

    if (type === 'Pawn' || type === 'King' || type === 'Zombie') return;

    movingPiece.xp = (movingPiece.xp >= movingPiece.xpBarrier) ? movingPiece.xpBarrier : movingPiece.xp + 1;
    if (pieces[coordF]) {
      const increment = pieces[coordF].xp;
      movingPiece.xp = ((movingPiece.xp + increment) < xpBarrier) ? movingPiece.xp + increment : xpBarrier;
    }
    if (movingPiece.xp === xpBarrier && movingPiece.name[0] !== 'p') evolve(pieces, coordI);
    return;
  }

  const changePositionStats = moveDetails => {
    const { pieces, coordI, coordF } = moveDetails;
    pieces.move = pieces.move + 1;
    pieces[coordI].hasMoved = true;
    increaseXp(moveDetails);
  }

  const updatePosition = moveDetails => {
    const { coordI, coordF, pieces, specialMove } = moveDetails;
    if (specialMove) {
      const action = handleSpecialMove(specialMove);
      if (action?.position) return action.position;
    }

    const currentState = movePiece({ pieces: {...pieces}, coordI, coordF });
    return currentState;
  }
  return [move];
}
