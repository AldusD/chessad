import { useState } from "react";

import { PromotionContainer } from "./styles";
import { usePiecesPictures } from "../../hooks/usePiecesPictures";

export default function PromotionModal ({ color, setPromotion, movePiece, selectedSquare, coordinates, position, usingSpell, pointOfView }) {
  const [pieces] = usePiecesPictures();
  const pieceType = ['Queen', 'Rook', 'Bishop', 'Knight'];
  const [closeModal, setCloseModal] = useState(false);
  const [modalPosition, setModalPosition] = useState((pointOfView === 'white') ? ['10', '-33'] : ['-33', '10']);
  const [pictures, setPictures] = useState([
   pieces[color[0] + pieceType[0]],
   pieces[color[0] + pieceType[1]], 
   pieces[color[0] + pieceType[2]],
   pieces[color[0] + pieceType[3]]
  ]);
  const promote = pieceType => {
    const pieceName = color[0] + pieceType;
    setPromotion((curr) => [false, '']);
    setCloseModal((curr) => true);
    return movePiece({ selectedSquare, coordinates, pieces: position, usingSpell, promote: pieceName });
  }

  return (
    <>
    { (closeModal) ? <></> : 
      <PromotionContainer position={(color === 'white') ? modalPosition[0] : modalPosition[1]}>
        {pictures?.map((picture, index) => <img src={picture} key={index} onClick={() => promote(pieceType[index])} /> )}
      </PromotionContainer>
    }
    </>
  );
}
