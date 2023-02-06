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
      let name;
      if (i === 1 || i === 8) name = 'wRook';
      else if (i === 2 || i === 7) name = 'wKnight';
      else if (i === 3 || i === 6) name = 'wBishop';
      else if (i === 5) name = 'wKing';
      else if (i === 4) name = 'wQueen';
      
      toSetPieces['8' + i] = {
        name,
        color: 'white',
        xp: 0
      }

      if (i === 1 || i === 8) name = 'bRook';
      else if (i === 2 || i === 7) name = 'bKnight';
      else if (i === 3 || i === 6) name = 'bBishop';
      else if (i === 4) name = 'bKing';
      else if (i === 5) name = 'bQueen';
      
      toSetPieces['1' + i] = {
        name,
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