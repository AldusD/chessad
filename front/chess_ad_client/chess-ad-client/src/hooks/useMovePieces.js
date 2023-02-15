const PIECES_XP_BARRIER = { KNIGHT: 5, BISHOP: 5, ROOK: 7, QUEEN: 10 };

export function useMovePieces () {
  const move = (moveInfo) => {
    const moveDetails = validateMove({...moveInfo, pieces: {...moveInfo.pieces}});
    if (moveDetails.error) return { error: true };
    if (moveDetails.abortUpdate) return { position: {...moveDetails.pieces} };
    const inCheck = isInCheck({ color: moveDetails.color, pieces: updatePosition(moveDetails), kingSquare: updatePosition(moveDetails).kingsCoord[moveDetails.color] });
    if (inCheck.error) return { error: true };

    changePositionStats(moveDetails);
    const position = updatePosition(moveDetails);
    const stats = isCheckmate({ pieces: position, color: moveDetails.color, });
    return { position, checkmate: stats.checkmate };
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
    
    if ((crossRule && rookObstacleRule()) || (diagonalRule && bishopObstacleRule(xMove, yMove))) return true;
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

      // verify safe path
      for (let i = 0; i <= CastleType; i++) { 
        const blockCoord = coordI[0] + (numCoordI[1] + i * step);
        if (isInCheck({ color, pieces, kingSquare: [blockCoord, [Number(blockCoord[0]), Number(blockCoord[1])]] }).error) return false;
      };
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

  const isCheckmate = moveInfo => {
    const { pieces, color } = moveInfo;
    const enemyColor = (color === 'white') ? 'black' : 'white';
    const kingSquare = pieces.kingsCoord[enemyColor];
    const checkingPieces = isInCheck({ pieces, color: enemyColor, kingSquare }).checkingPieces;
    if (checkingPieces?.length > 0) {
      // checking king move attempt  
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if(j === 0 && i === 0) continue;
          const coord = (kingSquare[1][0] + i).toString() + (kingSquare[1][1] + j);
          if (Number(coord[0]) < 1 || Number(coord[0]) > 8 || Number(coord[1]) < 1 || Number(coord[1]) > 8) continue;
          if (validateMove({ coordI: kingSquare[0], coordF: coord, pieces, usingSpell: false }).error) continue;
          
          const escape = !isInCheck({ pieces, color: enemyColor, kingSquare: [coord, [Number(coord[0]), Number(coord[1])]] }).error;
          if (escape) return { checkmate: false };
        }
      }

      // in double checks only attempt is to move the king
      if (checkingPieces.length > 1) return { checkmate: true };

      // checking piece blocking / capturing attempt
      // { coordI, coordF, numCoordI, numCoordF, pieces, color }      
      const pawnBlock = blockInfo => {
        const { coord, checkingPiece, color } = blockInfo; 
        const direction = (color === 'white') ? -1 : 1;
        const foward = `${Number(coord[0]) - direction}${coord[1]}`;
        const jump = `${Number(coord[0]) - 2 * direction}${coord[1]}`;
        const passantLeft = `${Number(checkingPiece.coord[0])}${Number(checkingPiece.coord[1]) - 1}`;
        const passantRight = `${Number(checkingPiece.coord[0])}${Number(checkingPiece.coord[1]) + 1}`;
        const passantAttack = `${Number(checkingPiece.coord[0]) + direction}${checkingPiece.coord[1]}`;

        const details1 = (pieces[foward]) ? validateMove({ coordI: foward, coordF: coord, pieces: {...pieces}, usingSpell: false }) : false;
        const details2 = (pieces[jump]) ? validateMove({ coordI: jump, coordF: coord, pieces: {...pieces}, usingSpell: false }) : false;
        const details3 = (pieces[passantLeft]) ? validateMove({ coordI: passantLeft, coordF: passantAttack, pieces: {...pieces}, usingSpell: false }) : false;
        const details4 = (pieces[passantRight]) ? validateMove({ coordI: passantRight, coordF: passantAttack, pieces: {...pieces}, usingSpell: false }) : false;

        const inCheck1 = (details1 && !details1.error) ? 
          isInCheck({ color: details1.color, pieces: updatePosition(details1), kingSquare: updatePosition(details1).kingsCoord[details1.color] }) 
          : 
          { error: true };
        
        const inCheck2 = (details2 && !details2.error) ? 
          isInCheck({ color: details2.color, pieces: updatePosition(details2), kingSquare: updatePosition(details2).kingsCoord[details2.color] }) 
          : 
          { error: true };

        const inCheck3 = (details3 && !details3.error) ? 
          isInCheck({ color: details3.color, pieces: updatePosition(details3), kingSquare: updatePosition(details3).kingsCoord[details3.color] }) 
          : 
          { error: true };
        
        const inCheck4 = (details4 && !details4.error) ? 
          isInCheck({ color: details4.color, pieces: updatePosition(details4), kingSquare: updatePosition(details4).kingsCoord[details4.color] }) 
          : 
          { error: true };

        if (!inCheck1.error) return true;
        if (!inCheck2.error) return true;
        if (pieces[checkingPiece.coord]?.name.includes('Pawn') && !inCheck3.error) return true;
        if (pieces[checkingPiece.coord]?.name.includes('Pawn') && !inCheck4.error) return true;
        
        return false;
      }
      const checkPiece = checkingPieces[0];

      if (checkPiece.checkDirection === 'pawn' || checkPiece.checkDirection === 'knight' || checkPiece.checkDirection === 'zombie') {
        const { coord } = checkPiece;
        const activePowerKnight = pieces[coord].active > pieces.move;  
        const block = isInCheck({ pieces, color, kingSquare: [coord, [Number(coord[0]), Number(coord[1])]] }).error;
          if (block && !activePowerKnight) return { checkmate: false };
          if (!activePowerKnight && pawnBlock({ coord: coord, checkingPiece: checkPiece, color: enemyColor })) return { checkmate: false };  
        }

      if (checkPiece.checkDirection === 'cross') {
        const axis = (kingSquare[1][0] - Number(checkPiece.coord[0]) === 0) ? 1 : 0;
        const direction = (Number(checkPiece.coord[axis]) - kingSquare[1][axis] > 0) ? -1 : 1;
        
        const squareTocheck = [checkPiece.coord, [Number(checkPiece.coord[0]), Number(checkPiece.coord[1])]];
        while (squareTocheck[0] != kingSquare[0]) {
          const block = isInCheck({ pieces, color, kingSquare: squareTocheck });

          if (block.error && (block.checkingPieces[0].checkDirection != 'pawn' || squareTocheck[0] === checkPiece.coord)) return { checkmate: false };
          if (pawnBlock({ coord: squareTocheck[0], checkingPiece: checkPiece, color: enemyColor })) return { checkmate: false };
          
          squareTocheck[1][axis] = squareTocheck[1][axis] + direction;
          squareTocheck[0] = `${squareTocheck[1][0]}${squareTocheck[1][1]}`;  
        }
      }

      if (checkPiece.checkDirection === 'diagonal') {
        const yDir = (kingSquare[1][0] - Number(checkPiece.coord[0]) > 0) ? 1 : -1;
        const xDir = (kingSquare[1][1] - Number(checkPiece.coord[1]) > 0) ? 1 : -1;
        
        const squareTocheck = [checkPiece.coord, [Number(checkPiece.coord[0]), Number(checkPiece.coord[1])]];
        while (squareTocheck[0] != kingSquare[0]) {
          const block = isInCheck({ pieces, color, kingSquare: squareTocheck });
          
          if (block.error && (block.checkingPieces[0].checkDirection != 'pawn' || squareTocheck[0] === checkPiece.coord)) return { checkmate: false };
          if (pawnBlock({ coord: squareTocheck[0], checkingPiece: checkPiece, color: enemyColor })) return { checkmate: false };
          
          squareTocheck[1][0] = squareTocheck[1][0] + yDir;
          squareTocheck[1][1] = squareTocheck[1][1] + xDir;
          squareTocheck[0] = `${squareTocheck[1][0]}${squareTocheck[1][1]}`;  
        }
      }

      return { checkmate: true };
    }

    return { checkmate: false };
  }

  const isInCheck = moveInfo => {
    const { pieces, color, kingSquare } = moveInfo;
    const enemyColor = (color === 'white') ? 'black' : 'white';
    const checkingPieces = [];

    const pawnCheck = () => {
      const direction = (enemyColor === 'white') ? 1 : -1;
      const leftPawn = (kingSquare[1][0] + direction).toString() + (kingSquare[1][1] - 1);
      const rightPawn = (kingSquare[1][0] + direction).toString() + (kingSquare[1][1] + 1);
      let check = false;

      if (pieces[leftPawn] && pieces[leftPawn].color === enemyColor && pieces[leftPawn].name.includes('Pawn')) {
        checkingPieces.push({ coord: leftPawn, checkDirection: 'pawn' });
        check = true;
      }
      if (pieces[rightPawn] && pieces[rightPawn].color === enemyColor && pieces[rightPawn].name.includes('Pawn')) {
        checkingPieces.push({ coord: rightPawn, checkDirection: 'pawn' });
        check = true;
      }

      if (check) return false;
      return true;
    }

    const zombieCheck = () => {
      const direction = (enemyColor === 'white') ? 1 : -1;
      const frontZombie = (kingSquare[1][0] + direction).toString() + (kingSquare[1][1]);
      const leftZombie = (kingSquare[1][0] + direction).toString() + (kingSquare[1][1] - 1);
      const rightZombie = (kingSquare[1][0] + direction).toString() + (kingSquare[1][1] + 1);
      const noTrheatRule = zombie => (zombie && zombie.color === enemyColor && zombie.name.includes('Zombie') && zombie.active > pieces.move);
      let check = false;
      
      if (noTrheatRule(pieces[frontZombie])) {
        checkingPieces.push({ coord: frontZombie, checkDirection: 'zombie' });
        check = true;
      };
      if (noTrheatRule(pieces[leftZombie])) {
        checkingPieces.push({ coord: leftZombie, checkDirection: 'zombie' });
        check = true;
      };
      if (noTrheatRule(pieces[rightZombie])) {
        checkingPieces.push({ coord: rightZombie, checkDirection: 'zombie' });
        check = true;
      };

      if (check) return false;
      return true;
    }

    const knightCheck = () => {
      const lookForKnight = (dirX, dirY) => {
        const coord1 = ((kingSquare[1][0] + 2 * dirY).toString() + (kingSquare[1][1] + 1 * dirX));
        const coord2 = ((kingSquare[1][0] + 1 * dirY).toString() + (kingSquare[1][1] + 2 * dirX));
        const knight1 = (pieces[coord1] && pieces[coord1].name.includes('Knight') && pieces[coord1].color === enemyColor);
        const knight2 = (pieces[coord2] && pieces[coord2].name.includes('Knight') && pieces[coord2].color === enemyColor);
        let check = false;

        if (knight1) {
          checkingPieces.push({ coord: coord1, checkDirection: 'knight' });
          check = true;
        }
        if (knight2) {
          checkingPieces.push({ coord: coord2, checkDirection: 'knight' });
          check = true;
        }

        if (check) return true;
        return false;
      }
      let check = false;

      // if in check also insert in the 
      if (lookForKnight(-1, -1)) check = true;
      if (lookForKnight(-1, 1)) check = true;
      if (lookForKnight(1, -1)) check = true;
      if (lookForKnight(1, 1)) check = true;
      
      if (check) return false;
      return true;
    }

    const crossCheck = () => {
      const isCrossPiece = name => (name.includes('Queen') || name.includes('Rook'));
      let check = false;

      // checking crosscheck in all four directions
      let squareTocheck = kingSquare[0][0] + (kingSquare[1][1] - 1);
      while (!pieces[squareTocheck] && squareTocheck[1] >= 1) {
        squareTocheck = squareTocheck[0] + (Number(squareTocheck[1]) - 1);
      }
      let blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isCrossPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'cross' });
        check = true;
      } 
      
      squareTocheck = kingSquare[0][0] + (kingSquare[1][1] + 1);
      while (!pieces[squareTocheck] && squareTocheck[1] <= 8) {
        squareTocheck = squareTocheck[0] + (Number(squareTocheck[1]) + 1);
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isCrossPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'cross' });
        check = true;
      }

      squareTocheck = (kingSquare[1][0] - 1) + kingSquare[0][1];
      while (!pieces[squareTocheck] && squareTocheck[1] <= 8) {
        squareTocheck = Number(squareTocheck[0] - 1) + squareTocheck[1];
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isCrossPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'cross' });
        check = true;
      }
      
      squareTocheck = (kingSquare[1][0] + 1) + kingSquare[0][1];
      while (!pieces[squareTocheck] && squareTocheck[0] <= 8) {
        squareTocheck = (Number(squareTocheck[0]) + 1) + squareTocheck[1];
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isCrossPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'cross' });
        check = true;
      } 

      if (check) return false;
      return true;
    }

    const diagonalCheck = () => {
      const isDiagonalPiece = name => (name.includes('Queen') || name.includes('Bishop'));  
      let check = false;

      // checking diagonalcheck in all four directions
      let squareTocheck = (kingSquare[1][0] - 1).toString() + (kingSquare[1][1] - 1).toString();
      while (!pieces[squareTocheck] && squareTocheck[0] >= 1 && squareTocheck[1] >= 1) {
        squareTocheck = (Number(squareTocheck[0]) - 1).toString() + (Number(squareTocheck[1]) - 1).toString();
      }
      let blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isDiagonalPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'diagonal'});  
        check = true;
      } 

      squareTocheck = (kingSquare[1][0] - 1).toString() + (kingSquare[1][1] + 1).toString();
      while (!pieces[squareTocheck] && squareTocheck[0] >= 1 && squareTocheck[1] <= 8) {
        squareTocheck = (Number(squareTocheck[0]) - 1).toString() + (Number(squareTocheck[1]) + 1).toString();
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isDiagonalPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'diagonal'});  
        check = true;
      }

      squareTocheck = (kingSquare[1][0] + 1).toString() + (kingSquare[1][1] - 1).toString();
      while (!pieces[squareTocheck] && squareTocheck[0] <= 8 && squareTocheck[1] >= 1) {
        squareTocheck = (Number(squareTocheck[0]) + 1).toString() + (Number(squareTocheck[1]) - 1).toString();
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isDiagonalPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'diagonal'});  
        check = true;
      }

      squareTocheck = (kingSquare[1][0] + 1).toString() + (kingSquare[1][1] + 1).toString();
      while (!pieces[squareTocheck] && squareTocheck[0] <= 8 && squareTocheck[1] <= 8) {
        squareTocheck = (Number(squareTocheck[0]) + 1).toString() + (Number(squareTocheck[1]) + 1).toString();
      }
      blocking = pieces[squareTocheck];
      if (blocking && blocking.color === enemyColor && isDiagonalPiece(blocking.name)) {
        checkingPieces.push({ coord: squareTocheck, checkDirection: 'diagonal'});  
        check = true;
      }      
      
      if (check) return false;
      return true;
    }

    pawnCheck();
    if (checkingPieces.length < 2) zombieCheck();
    if (checkingPieces.length < 2) knightCheck();
    if (checkingPieces.length < 2) crossCheck();
    if (checkingPieces.length < 2) diagonalCheck();
    if (checkingPieces.length != 0) return { error: true, checkingPieces };
    return { error: false };
  }

  const validateMove = (moveInfo) => {
    const { coordI, coordF, pieces, usingSpell } = moveInfo;
    const movingPiece = pieces[coordI];
    const color = movingPiece.color;
    const details = { data: { coordI, coordF, pieces, color, specialMove: false } };
    const pieceType = (movingPiece.name[0] === 'p') ?  movingPiece.name.slice(2) : movingPiece.name.slice(1);
    const numCoordI = [Number(coordI[0]), Number(coordI[1])];
    const numCoordF = [Number(coordF[0]), Number(coordF[1])];
    const info = { 
      coordI, coordF,
      numCoordI, numCoordF, 
      pieces, color, 
      movingPiece, pieceType, 
      usingSpell };

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

    if ((pieces.move % 2 === 0 && color === 'white') || (pieces.move % 2 === 1 && color === 'black')) return { error: true };
    if (pieces[coordF]) {
      const visiblePieces = killInvisiblePiece(info);
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

      const kingState = movePiece({ pieces, coordI, coordF: kingCoordF });
      const kingAndRookState = movePiece({ pieces: kingState, coordI: coordF, coordF: rookCoordF });
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
    if (movingPiece.name.includes('King')) currentState.kingsCoord[movingPiece.color] = [coordF, [Number(coordF[0]), Number(coordF[1])]];
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
