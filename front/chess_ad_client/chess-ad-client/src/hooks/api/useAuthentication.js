import { useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

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
  const { userData, setUserData } = useUser();
  const navigateToHome = (data, navigate) => {
    console.log('dtobj', data, data[0])
    if (data[0] !== '{') return;
    localStorage.setItem("accessToken", JSON.parse(data).token.accessToken);
    localStorage.setItem("refreshToken", JSON.parse(data).token.refreshToken);
    console.log('user', JSON.parse(data).user)
    setUserData({ ...JSON.parse(data).user });
    return;
  }
  
  return useMutation(login, { onSuccess: navigateToHome });
}

export function useSignup () {
  return useMutation(register);  
}