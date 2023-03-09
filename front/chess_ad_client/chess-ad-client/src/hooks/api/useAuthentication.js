import { useQuery, useMutation } from "react-query";

const API = process.env.REACT_APP_API_BASE_URL;

const login = userData => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(userData) };
  return fetch(`${API}/auth/sign-in`, options);
}

const register = async (userData) => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(userData) };
  const response = await fetch(`${API}/auth/sign-up`, options);
  const data = response.text();
  return data;
}

export function useSignin () {
  return useMutation(login);  
}

export function useSignup () {
  return useMutation(register);  
}