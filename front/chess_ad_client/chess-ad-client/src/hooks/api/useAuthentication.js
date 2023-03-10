import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_BASE_URL;

const login = async (userData) => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(userData) };
  const response = await fetch(`${API}/auth/sign-in`, options);
  const data = response.text();
  return data;
}

const register = async (userData) => {
  const options = { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: JSON.stringify(userData) };
  const response = await fetch(`${API}/auth/sign-up`, options);
  const data = response.text();
  return data;
}

export function useSignin () {
  const navigateToHome = (data, navigate) => {
    if (data === 'Unauthorized') return;
    const tokens = JSON.parse(data).token;
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
    return;
  }
  
  return useMutation(login, { onSuccess: navigateToHome });
}

export function useSignup () {
  return useMutation(register);  
}