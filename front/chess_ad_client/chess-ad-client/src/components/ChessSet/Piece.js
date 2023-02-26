import { useState, useEffect } from "react";
import { PieceStyle, PieceContainer, Filter} from "./styles";
import { usePiecesPictures } from "../../hooks/usePiecesPictures"
import XpBar from "./XpBar";

export default function Piece({ pieceInfo, move, refresh }) {
  const { name, color, active } = pieceInfo;
  const [pieces] = usePiecesPictures();
  const [isActive, setIsActive] = useState();
  const [shouldDisappear, setShouldDisappear] = useState();
  useEffect(() => {
    const spellType = (active > move) ? name : '';
    const isTemporaryPiece = (name.slice(1) === 'Zombie' || name.slice(1) === 'Broken');
    
    setIsActive(spellType);
    setShouldDisappear(!isActive && isTemporaryPiece);
  }, [refresh.value, isActive]);

  return (
    <>
    {shouldDisappear ?
      <></>
      :
      <PieceContainer>
        <PieceStyle src={pieces[name]} size={(name[0] === 'p') ? '10vh' : '8vh'} >
          {(isActive && isActive[2] === 'K') ? <Filter /> : <></>}
        </PieceStyle>
        <XpBar 
          className={'bar'} 
          name={pieceInfo.name} 
          xp={pieceInfo.xp} 
          xpBarrier={pieceInfo.xpBarrier}
          refresh={refresh} />
    </PieceContainer>
    }
    </>
  )
}
