import { HeaderStyles, Item } from './styles';
import Logo from "../../assets/logo.jpg"
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

export default function Header () {
  const { userData } = useUser();
  console.log(userData)

  return (
      <HeaderStyles>
        <div>
          <div>
            <Link to='/home' ><img src={Logo} /></Link>
            <Link to={`/users/${userData?.username || 'Guest'}`} ><Item>{userData?.username || 'Guest'}'s page</Item></Link>
            <Link to='/howtoplay' ><Item>How to play</Item></Link>
            <Item>Contact</Item>
          </div>
          <Item>Logout</Item>
        </div>
      </HeaderStyles>
  )
}
