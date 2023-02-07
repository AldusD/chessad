import { useState, useEffect } from "react";
import styled from "styled-components";
import { usePiecesPictures } from "../../hooks/usePiecesPictures"

export default function Piece({ pieceInfo, move, refresh }) {
  const { name, color, xp, active } = pieceInfo;
  const [pieces] = usePiecesPictures();
  const [isActive, setIsActive] = useState();
  useEffect(() => {
    console.log(active, move)
    setIsActive(active > move);
  }, [refresh.value]);

  return (
    <PieceStyle src={pieces[name]} size={(name[0] === 'p') ? '10vh' : '8vh'} >
      {(isActive) ? <Filter /> : <></>}
    </PieceStyle>
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