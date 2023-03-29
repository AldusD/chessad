import { useState } from 'react';
import { GameFormStyles, CreateForm, SideButton, Options } from "./styles";
import Form from '../../comons/Form';
import { FieldError } from '../../comons/styles';
import { useCreateGame } from '../../../hooks/api/useGameSetting';

export default function GameForm () {
  const [selectedTime, setSelectedTime] = useState(-2);
  const [selectedSide, setSelectedSide] = useState(-2);
  const [form, setForm] = useState({ time: '', increment: '' });
  const [errors, setErrors] = useState({ time: '', side: '' });
  const timeControls = ['15 + 5', '10 + 5', '10 + 0', '5 + 3', '3 + 2', '3 + 0', '2 + 1', 'Custom'];
  const customIndex = (timeControls.length - 1);

  const {
    mutate: createGameForm,
    data: GameData,
  } = useCreateGame();

  const requestNewGame = async(gameData) => {
    try {
      const { time: timeString, side } = gameData;
      const time = timeString.split(' ')[0];
      const increment = timeString.split(' ')[2];

      const result = await createGameForm({ time, increment, side });
    } catch(error) {
      console.log('err', error);
    }
  }

  const createGame = () => {
    const { data: gameData, error } = validateGameOptions();
    if (!error) return requestNewGame(gameData);
    return;    
  }

  const validateGameOptions = () => {
    const data = { side: selectedSide, time: selectedTime };
    setErrors({ time: '', side: '' });
    const errors = {};

    if (selectedTime < 0) errors.time = 'Select a time control!';
    if (selectedSide < 0) errors.side = 'Select a side!';    
    if (selectedTime === customIndex) {
      if (form.time <= 0 || form.increment < 0) errors.time = 'Select a valid time control!';
      if (!form.time || !form.increment) errors.time = 'Select a time control!';
      data.time = `${form.time} + ${form.increment}`;
    } else data.time = timeControls[selectedTime];
    const sides = [' ', 'white', 'black', 'random'];
    data.side = sides[selectedSide]

    setErrors(errors);
    if (errors.side || errors.time) return { error: true };
    return { data, error: false };
  }

  const selectOption = (option, type, setType) => {
    if (type === option) return setType(-2);
    return setType(option);
  }

  const selectTime = (timeControl) => selectOption(timeControl, selectedTime, setSelectedTime);
  const selectSide = (side) => selectOption(side, selectedSide, setSelectedSide);

  const updateForm = e => setForm({ ...form, [e.target.name]: e.target.value});

  return (
    <GameFormStyles>
     <h2>Create a Game</h2>
     <CreateForm>
        <h3>Choose time control:</h3>
        <Options selected={selectedTime + 1 || 0} >
          { 
            timeControls.map((control, i) => <button key={control} className='time' onClick={() => selectTime(i)} >{control}</button>) 
          }
        </Options>
        {(selectedTime === customIndex) ?
          <Form direction='row' inputSize='70%' >
            <span>Custom</span>
            <div><input name="time" type="number" placeholder="Time (min)" onChange={ e => updateForm(e) } value={form.email}></input> </div>
            <span className='big' >+</span>
            <div><input name="increment" type="number" placeholder="Increment (sec)" onChange={ e => updateForm(e) } value={form.email}></input> </div>
          </Form> 
          : 
          <></> 
        }
        { errors.time ? <FieldError>{errors.time}</FieldError> : <></> }
        <h3>Choose side:</h3>
        <Options selected={selectedSide} >
          <SideButton bg="white" color='black' onClick={() => selectSide(1)} >As white</SideButton>
          <SideButton bg="black" color='white' onClick={() => selectSide(2)} >As black</SideButton>
          <SideButton bg="#333" color='white' onClick={() => selectSide(3)} >Random</SideButton>
        </Options>
        { errors.side ? <FieldError>{errors.side}</FieldError> : <></> }

     </CreateForm>
      <button onClick={createGame} >Create Game</button>
    </GameFormStyles>
  ) 
}