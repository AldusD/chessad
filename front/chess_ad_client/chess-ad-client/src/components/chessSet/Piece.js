import { useState, useEffect } from "react";
import styled from "styled-components";
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

const PieceStyle = styled.div`
  display: flex;
  position: relative;
  height: 10vh;
  width: 10vh;
  background-image: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${props => props.size};
  margin-right: 0.2rem;

  div {
    position: absolute;
    font-size: 1rem;
    z-index: 1;
  }  
`;

const Filter = styled.div`
  height: 10vh;
  width: 10vh;
  background-color: #6c277b80;
`;

const PieceContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;