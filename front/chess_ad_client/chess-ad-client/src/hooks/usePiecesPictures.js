import wPawn from '../assets/pieces/w-pawn.png';
import bPawn from '../assets/pieces/b-pawn.png';
import wKnight from '../assets/pieces/w-knight.png';
import bKnight from '../assets/pieces/b-knight.png';
import wBishop from '../assets/pieces/w-bishop.png';
import bBishop from '../assets/pieces/b-bishop.png';
import wRook from '../assets/pieces/w-rook.png';
import bRook from '../assets/pieces/b-rook.png';
import wQueen from '../assets/pieces/w-queen.png';
import bQueen from '../assets/pieces/b-queen.png';
import wKing from '../assets/pieces/w-king.png';
import bKing from '../assets/pieces/b-king.png';
import pwKnight from '../assets/pieces/w-p-knight.png';
import pbKnight from '../assets/pieces/b-p-knight.png';
import pwBishop from '../assets/pieces/p-w-bishop.png';
import pbBishop from '../assets/pieces/p-b-bishop.png';
import wZombie from '../assets/pieces/w-zombie.png';
import bZombie from '../assets/pieces/b-zombie.png';

export function usePiecesPictures () {
    const pieces = {
        wPawn, bPawn, 
        wKnight, bKnight, pwKnight, pbKnight,
        wBishop, bBishop, pwBishop, pbBishop,
        wRook, bRook,
        wQueen, bQueen,
        wKing, bKing,
        wZombie, bZombie
    }
    
    return [pieces];
}