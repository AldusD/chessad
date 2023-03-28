import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

const API = process.env.REACT_APP_API_BASE_URL;

const listGames = async () => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'GET' };
  const response = await fetch(`${API}/game-setting`, options);
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
  return useMutation(createGame);  
}

export function useGetGames () {
  return useQuery(['games'], listGames);  
}