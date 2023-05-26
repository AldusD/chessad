import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PageStyle, Menu, GameContainer, PovButton, ResetButton, Buttons } from "./styles";
import { useGame } from  "../../../contexts/GameContext";
import Chessboard from "../../ChessSet/Chessboard";
import PlayerData from "../../GameInfo/PlayerData";
import Guest from "../../../assets/guest.jpg";
import Logo from "../../../assets/logo.jpg"
import Login from "../../AuthForms/Login";
import SignupPage from "../../AuthForms/Signup";

export default function MainPage () {
  const [selectedForm, setSelectedForm] = useState('login');  
  const [pointOfView, setPointOfView] = useState('white');
  const [reset, setReset] = useState(false);
  const { setGameStatus, STATUS } = useGame();

  const resetBoard = () => {
    setReset(!reset);
    setGameStatus(STATUS.ONGOING);
  }
  
  useEffect(() => {}, [pointOfView]);
  
  return (
      <PageStyle>
        <Menu>
          <img src={Logo} />
          {(selectedForm === 'login') ? 
            <Login setSelectedForm={setSelectedForm} /> : <SignupPage setSelectedForm={setSelectedForm} />
          }
          <Link to='/howtoplay' >How to play!</Link>
          <Buttons>
            {(pointOfView === 'white') ? 
              <PovButton onClick={() => setPointOfView('black')} textColor={'#333'} backgroundColor={'white'} >POV: White</PovButton>
              : 
              <PovButton onClick={() => setPointOfView('white')} textColor={'white'} backgroundColor={'#333'} >POV: Black</PovButton>
            }
            <ResetButton onClick={resetBoard} >Reset</ResetButton>
          </Buttons>
        </Menu>
        <GameContainer>
          <Chessboard pointOfView={pointOfView} reset={reset} />
          <div className="data-container">
            <PlayerData 
              profilePicture={Guest} 
              username={'Guest'} 
              color={pointOfView === "white" ? "black" : "white"}
              pointOfView={pointOfView}
              showOptions={false} />
            <PlayerData 
              profilePicture={Guest}
              username={'Guest'} 
              color={pointOfView}
              pointOfView={pointOfView} 
              showOptions={true}
              isAnalysisBoard={true} />
          </div>
        </GameContainer>
      </PageStyle>
  )
}
