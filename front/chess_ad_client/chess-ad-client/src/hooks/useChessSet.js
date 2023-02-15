export function useChessSet () {
  const startCoordinates = () => {
    const coordinates = [];
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        coordinates.push([i, j]);    
      }
    }
    return coordinates;
  }
  
  const startPieces = () => {
    const toSetPieces = {};
    // move counter
    toSetPieces.move = 1;
    toSetPieces.kingsCoord = {
      white: ['85', [8, 5]],
      black: ['15', [1, 5]]
    };

    // pawns
    for(let i = 1; i <= 8; i++) {
      toSetPieces['7' + i] = {
        name: 'wPawn',
        color: 'white',
        xp: 0
      }
      toSetPieces['2' + i] = {
        name: 'bPawn',
        color: 'black',
        xp: 0
      }
    }

    // back rank pieces
    for(let i = 1; i <= 8; i++) {
      let info = {};
      if (i === 1 || i === 8) info = { name: 'wRook', xpBarrier: 7 };
      else if (i === 2 || i === 7) info = { name: 'wKnight', xpBarrier: 5 };
      else if (i === 3 || i === 6) info = { name: 'wBishop', xpBarrier: 5 };
      else if (i === 4) info = { name: 'wQueen', xpBarrier: 10 };
      else if (i === 5) info = { name: 'wKing' };
      
      toSetPieces['8' + i] = {
        ...info,
        color: 'white',
        xp: 0
      }

      if (i === 1 || i === 8) info = { name: 'bRook', xpBarrier: 10 };
      else if (i === 2 || i === 7) info = { name: 'bKnight', xpBarrier: 5 };
      else if (i === 3 || i === 6) info = { name: 'bBishop', xpBarrier: 5 };
      else if (i === 4) info = { name: 'bQueen', xpBarrier: 10 };
      else if (i === 5) info = { name: 'bKing' };
      
      toSetPieces['1' + i] = {
        ...info,
        color: 'black',
        xp: 0
      }
    }
    
    return toSetPieces;
  }
  
  return [
    startCoordinates,
    startPieces
  ]
} 