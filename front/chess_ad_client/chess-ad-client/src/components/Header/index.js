import { HeaderStyles, Item } from './styles';
import Logo from "../../assets/logo.jpg"
import { Link } from 'react-router-dom';

export default function Header (props) {
  const { username } = props;
  return (
      <HeaderStyles>
        <div>
          <div>
            <Link to='/home' ><img src={Logo} /></Link>
            <Link to={`/users/${username}`} ><Item>{username}'s page</Item></Link>
            <Link to='/howtoplay' ><Item>How to play</Item></Link>
            <Item>Contact</Item>
          </div>
          <Item>Logout</Item>
        </div>
      </HeaderStyles>
  )
}
