import { PiecesXpBarrier } from "./enums";

function startPieces () {
  const toSetPieces = {} as any;
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
    if (i === 1 || i === 8) info = { name: 'wRook', xpBarrier: PiecesXpBarrier.ROOK, hasMoved: false };
    else if (i === 2 || i === 7) info = { name: 'wKnight', xpBarrier: PiecesXpBarrier.KNIGHT, hasMoved: false };
    else if (i === 3 || i === 6) info = { name: 'wBishop', xpBarrier: PiecesXpBarrier.BISHOP, hasMoved: false };
    else if (i === 4) info = { name: 'wQueen', xpBarrier: PiecesXpBarrier.QUEEN, hasMoved: false };
    else if (i === 5) info = { name: 'wKing', hasMoved: false };
    
    toSetPieces['8' + i] = {
      ...info,
      color: 'white',
      xp: 0
    }
    if (i === 1 || i === 8) info = { name: 'bRook', xpBarrier: PiecesXpBarrier.ROOK, hasMoved: false };
    else if (i === 2 || i === 7) info = { name: 'bKnight', xpBarrier: PiecesXpBarrier.KNIGHT, hasMoved: false };
    else if (i === 3 || i === 6) info = { name: 'bBishop', xpBarrier: PiecesXpBarrier.BISHOP, hasMoved: false };
    else if (i === 4) info = { name: 'bQueen', xpBarrier: PiecesXpBarrier.QUEEN, hasMoved: false };
    else if (i === 5) info = { name: 'bKing', hasMoved: false };
    
    toSetPieces['1' + i] = {
      ...info,
      color: 'black',
      xp: 0
    }
  }
  
  return toSetPieces;
}

export default JSON.stringify(startPieces());
