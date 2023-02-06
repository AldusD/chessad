import styled from "styled-components";
import { usePiecesPictures } from "../../hooks/usePiecesPictures"

export default function Piece({ pieceInfo, move }) {
  const { name, color, active } = pieceInfo;
  const [pieces] = usePiecesPictures();

  return (
      <>
        <PieceStyle src={pieces[name]} size={(name[0] === 'p') ? '10vh' : '8vh'} />
        {active >= move ? <Filter /> : <></>} 
      </>
      
  )
}

const PieceStyle = styled.div`
  display: flex;
  height: 10vh;
  width: 10vh;
  background-image: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${props => props.size};

  :hover {
    cursor: grab;
  }

  :active {
    cursor: grabbing;
  }
  
`;

const Filter = styled.div`
  height: 10vh;
  width: 10vh;
  background-color: green;
  z-index: 1;
`;