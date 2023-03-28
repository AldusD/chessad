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

const getUserData = async () =>  {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('accessToken')}` }, 
      method: 'GET', 
    };

  const response = await fetch(`${API}/auth/data`, options);
  const data = response.text();
  return data;
}

const getNewTokens = async () =>  {
  const options = { 
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${localStorage.getItem('refreshToken')}` }, 
    method: 'GET',  
  };

  const response = await fetch(`${API}/auth/token`, options);
  const data = response.text();
  console.log('user data', data);
  return data;
}

export function useSignin () {
  const { userData, setUserData } = useUser();
  const navigateToHome = (data) => {
    if (data[0] !== '{') return;
    localStorage.setItem("accessToken", JSON.parse(data).token.accessToken);
    localStorage.setItem("refreshToken", JSON.parse(data).token.refreshToken);
    setUserData({ ...JSON.parse(data).user });
    return;
  }
  
  return useMutation(login, { onSuccess: navigateToHome });
}

export function useSignup () {
  return useMutation(register);  
}

export function useUserData () {
  const { userData, setUserData } = useUser();
  const { mutate: tryNewTokens } = useNewTokens();
  
  const fillUserData = (data) => {
    if (data[0] !== '{') return; 
    setUserData({ ...JSON.parse(data).user });
    return;
  }

  return useMutation(getUserData, { onSuccess: fillUserData });
}

export function useNewTokens () {
  const fillTokens = (data) => {
    if (data[0] !== '{') return;
    localStorage.setItem("accessToken", JSON.parse(data).token.accessToken);
    localStorage.setItem("refreshToken", JSON.parse(data).token.refreshToken);
    return;
  }

  return useMutation(getNewTokens, { onSuccess: fillTokens });
}
