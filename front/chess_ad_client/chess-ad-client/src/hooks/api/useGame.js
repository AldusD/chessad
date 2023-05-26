import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useGame } from "../../contexts/GameContext";

const API = process.env.REACT_APP_API_BASE_URL;

const listGameByPath = async (path) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json'
    }, 
    method: 'GET' 
  };

  const response = await fetch(`${API}/game/${path}`, options);
  const data = response.json();
  return data;
}

const listGames = async (username) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json'
    },
    method: 'GET' 
  };

  const response = await fetch(`${API}/game?u=${(username) ? username : ''}`, options);
  const data = response.json();
  return data;
}

const getPlayerToken = async (path) => {
    const options = { 
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      }, 
      method: 'GET' 
    };
  
    const response = await fetch(`${API}/game/${path}/token`, options);
    if (response.status != 200) return { error: response.text(), status: response.status };
    const data = response.json();
    return data;
  }

const joinGame = async (path) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, 
    method: 'POST', 
    body: JSON.stringify({ path }) 
  };

  const response = await fetch(`${API}/game/join`, options);
  const data = response.text();
  return data;
}

const finishGame = async (resultToken) => {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
    }, 
    method: 'PATCH', 
    body: JSON.stringify({ resultToken }) 
  };

  const response = await fetch(`${API}/game`, options);
  const data = response.text();
  return data;
}

export function useJoinGame () {
  const savePlayerToken = (data) => {
    if (data[0] !== '{') return;
    return localStorage.setItem("playerToken", JSON.parse(data).playerToken);
  }

  return useMutation(joinGame, { onSuccess: savePlayerToken });
}

export function useGetGames () {
  return useMutation(listGames);
}

export function useGetGameByPath () {
  return useMutation(listGameByPath);
}

export function usePlayerToken () {      
    const fillToken = (data) => {
      if (!data.playerToken) return;
      return localStorage.setItem("playerToken", data.playerToken);
    }
  
    return useMutation(getPlayerToken, { onSuccess: fillToken });  
}

export function useFinishGame () {
  return useMutation(finishGame);
}
