import { useEffect, useState } from 'react';
import { Board } from './styles';
import Square from './Square';
import { useChessSet } from '../../hooks/useChessSet';
import { useGame } from '../../contexts/GameContext';

export default function Chessboard({ pointOfView, reset, toInsertPosition }) {
  const [startCoordinates, startPieces] = useChessSet();
  const [pieces, setPieces] = useState(startPieces());
  const [squares, setSquares] = useState(startCoordinates());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [promotion, setPromotion] = useState([false, '']);
  const [usingSpell, setUsingSpell] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { position, gameStatus, STATUS } = useGame();

  useEffect(() => {
    if (pointOfView === 'black' && squares[0][0] === 1) setSquares([...squares.reverse()]);
    if (pointOfView === 'white' && squares[0][0] === 8) setSquares([...squares.reverse()]);
  }, [pointOfView]);

  useEffect(() => {
    if (!position) return;
    setPieces(position);
  }, [position])

  useEffect(() => {if(toInsertPosition) setPieces(toInsertPosition)}, [toInsertPosition])
  useEffect(() => {setPieces(startPieces())}, [reset])

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
            setUsingSpell={setUsingSpell}
            promotion={promotion}
            setPromotion={setPromotion}
            refresh={ {value: refresh, set: setRefresh }} 
            pointOfView={pointOfView} />
          )}
          {usingSpell ? 
            <button onClick={() => setUsingSpell(!usingSpell)} className={'on'} >Spell</button>
            :
            <button onClick={() => setUsingSpell(!usingSpell)} className={'off'} >Spell</button>
          }
      </Board>
)};
