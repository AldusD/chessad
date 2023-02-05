import styled from "styled-components";
import { usePiecesPictures } from "../../hooks/usePiecesPictures"

export default function Piece({ name, color }) {
    const [pieces] = usePiecesPictures();

    return (
        <PieceStyle src={pieces[name]} />
    )
}

const PieceStyle = styled.div`
  display: flex;
  height: 10vh;
  width: 10vh;
  background-image: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: 8vh;

  :hover {
    cursor: grab;
  }

  :active {
    cursor: grabbing;
  }
  
`;