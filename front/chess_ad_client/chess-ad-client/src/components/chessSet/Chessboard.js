import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Square from './Square';
import { useChessSet } from '../../hooks/useChessSet';

export default function Chessboard() {
  const [startCoordinates, startPieces] = useChessSet();
  const [pieces, setPieces] = useState(startPieces());
  const [squares, setSquares] = useState(startCoordinates());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [usingSpell, setUsingSpell] = useState(false);
  useEffect(() => {
    console.log(usingSpell);
  }, [usingSpell])
  return (
    <Board>
      {squares?.map((square, index) => 
        <Square 
          key={index} 
          color={((square[0] + square[1]) % 2 === 0) ? '#cdd7e2' : '#487aaf'}
          coordinates={square[0].toString() + square[1].toString()} 
          pieces={pieces} 
          setPieces={setPieces}
          setSelectedSquare={setSelectedSquare}
          selectedSquare={selectedSquare}
          usingSpell={usingSpell}
          setUsingSpell={setUsingSpell} />
        )}
        <button active={usingSpell ? 'active' : 'inactive'} onClick={() => setUsingSpell(!usingSpell)} >Spell</button>
    </Board>
)};

const Board = styled.div`
  height: 80vh;
  width: 80vh;
  display: grid;
  grid-template-columns: repeat(8, 10vh);
  grid-template-rows: repeat(8, 10vh);
  background-color: blue;

  button {
    height: 4vh;
    width: 6rem;
    margin-top: 2vh;
    border: none;
    border-radius: 4px;

    background-color: ${props => props.acitve === 'active' ? 'green' : 'red'};
    color: ${props => props.acitve === 'active' ? 'yellow' : 'orange'};
}
`;
