import { useState, useEffect } from "react";
import styled from "styled-components";
import { usePiecesPictures } from "../../hooks/usePiecesPictures"
import XpBar from "./XpBar";

export default function Piece({ pieceInfo, move, refresh }) {
  const { name, color, active } = pieceInfo;
  const [pieces] = usePiecesPictures();
  const [isActive, setIsActive] = useState();
  useEffect(() => {
    setIsActive(active > move);
  }, [refresh.value]);

  return (
    <PieceContainer>
      <PieceStyle src={pieces[name]} size={(name[0] === 'p') ? '10vh' : '8vh'} >
        {(isActive) ? <Filter /> : <></>}
      </PieceStyle>
      <XpBar name={pieceInfo.name} xp={pieceInfo.xp} xpBarrier={pieceInfo.xpBarrier} />
    </PieceContainer>

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
  z-index: 1;
`;

const PieceContainer = styled.div`
  display: flex;
  align-items: center;
`;