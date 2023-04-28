import { HeaderStyles, Item } from './styles';
import Logo from "../../assets/logo.jpg"
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { useLogout, useNewTokens, useUserData } from '../../hooks/api/useAuthentication';

export default function Header () {
  const { userData, setUserData } = useUser();
  const {
    mutate: requestUserData,
    data: userNewData
  } = useUserData();
  const {
    mutate: requestTokens,
    data: newTokensData
  } = useNewTokens();
  const {
    mutate: requestLogout,
    data: logoutData
  } = useLogout();

  const navigate = useNavigate()

  const fillUserData = async () => {
    await requestUserData();
  }

  const logout = async () => {
    await requestLogout();
    navigate('/');
  }

  useEffect(() => {
    fillUserData();
  }, [])

  useEffect(() => {
    if (userNewData === 'invalid token') {
      requestTokens();
    }
  }, [userNewData])

  useEffect(() => {
    if (newTokensData === 'refresh token expired or invalid') navigate('/');
    
    if (userNewData === 'invalid token') {
      requestUserData();
    }
  }, [newTokensData])

  return (
      <HeaderStyles>
        <div>
          <div>
            <Link to='/home' ><img src={Logo} /></Link>
            <Link to={`/users/${userData?.username || 'Guest'}`} ><Item>{userData?.username || 'Guest'}'s page</Item></Link>
            <Link to='/howtoplay' ><Item>How to play</Item></Link> 
            <Item>Contact</Item>
          </div>
          <Item onClick={logout} >Logout</Item>
        </div>
      </HeaderStyles>
  )
}
