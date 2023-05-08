import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext";

const API = process.env.REACT_APP_API_BASE_URL;

const listGames = async () => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'GET' };
  const response = await fetch(`${API}/game-setting`, options);
  const data = response.json();
  return data;
}

const listGameByPath = async (path) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
      }, 
    method: 'GET' 
  };

  const response = await fetch(`${API}/game-setting/${path}`, options);
  const data = response.json();
  return data;
}

const createGame = async (gameData) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, 
    method: 'POST', 
    body: JSON.stringify(gameData) 
  };

  const response = await fetch(`${API}/game-setting`, options);
  const data = response.text();
  return data;
}

export function useCreateGame () {
  const savePlaterToken = (data) => {
    if (data[0] !== '{') return;
    return localStorage.setItem("playerToken", JSON.parse(data).playerToken);
  }

  return useMutation(createGame, { onSuccess: savePlaterToken });  
}

export function useGetGames () {
  return useQuery(['games'], listGames, { refetchInterval: 5000 });  
}

export function useGetGameByPath () {
  const { userData } = useUser();
  const { setGameSettings } = useGame();

  const fillGameSettings = (data) => {
    setGameSettings({ player: userData, path: data.path });
  }

  return useMutation(listGameByPath, { onSuccess: fillGameSettings });  
}