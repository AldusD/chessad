import { HeaderStyles, Item } from './styles';
import Logo from "../../assets/logo.jpg"
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useEffect } from 'react';
import { useLogout, useNewTokens, useUserData } from '../../hooks/api/useAuthentication';

export default function Header ({ type }) {
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
    if (type === "alternative") return;
    fillUserData();
  }, [])

  useEffect(() => {
    if (type === "alternative") return;
    if (userNewData === 'invalid token') {
      requestTokens();
    }
  }, [userNewData])

  useEffect(() => {
    if (type === "alternative") return;
    if (newTokensData === 'refresh token expired or invalid') navigate('/');
    
    if (userNewData === 'invalid token') {
      requestUserData();
    }
  }, [newTokensData])

  return (
      <HeaderStyles>
        <div>
          <div>
            
            { (type === 'alternative') ?
              <><Link to='/' ><img src={Logo} /></Link>
              <Link to='/' ><Item>Login page</Item></Link>
              <span onClick={() => navigate(-1)} ><Item>Return</Item></span></>
              :
              <><Link to='/home' ><img src={Logo} /></Link>
              <Link to={'/userPage'} ><Item>{userData?.username || 'Guest'}'s page</Item></Link>
              <Link to='/home' ><Item>Home</Item></Link>
              <Link to='/howtoplay' ><Item>How to play</Item></Link>
              <Link to='/contactus' ><Item>Contact us</Item></Link></> 
            }
          </div>
          { (type === "alternative") ? <></> : <Item onClick={logout} >Logout</Item> }
        </div>
      </HeaderStyles>
  )
}
