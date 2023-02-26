import { useState } from "react";

import { PageStyle, Menu, GameContainer } from "./styles";
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import Guest from "../../../assets/guest.jpg";
import Logo from "../../../assets/logo.jpg"
import Login from "../../AuthForms/Login";
import SignupPage from "../../AuthForms/Signup";
import { Link } from "react-router-dom";

export default function MainPage () {
  const [selectedForm, setSelectedForm] = useState('login');  
  
  return (
      <PageStyle>
        <Menu>
          <img src={Logo} />
          {(selectedForm === 'login') ? 
            <Login setSelectedForm={setSelectedForm} /> : <SignupPage setSelectedForm={setSelectedForm} />
          } 
          <Link to='/howtoplay' >New here? Learn how to play!</Link>
        </Menu>
        <GameContainer>
          <Chessboard pointOfView={'white'} />
          <div className="data-container">
            <PlayerData profilePicture={Guest} username={'Guest'} color={'black'} showOptions={false} />
            <PlayerData profilePicture={Guest} username={'Guest'} color={'white'} showOptions={true} />
          </div>
        </GameContainer>
      </PageStyle>
  )
}
