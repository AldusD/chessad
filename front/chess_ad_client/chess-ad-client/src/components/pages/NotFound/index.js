import { useNavigate } from "react-router-dom"
import { Container, Menu } from "./styles"
import Chessboard from "../../ChessSet/Chessboard";
import { GameContainer } from "../Game/styles";
import Logo from "../../../assets/logo.jpg";
import Header from "../../Header";

export default function NotFound () {
  const navigate = useNavigate();

  return (
    <>
    <Header type="alternative" />
    <Container>
      <Menu>
        <img src={Logo} alt="Logo" />
        <span>Not found</span>
        <div>
          <button onClick={() => navigate(-1)} >Return</button>
          <button onClick={() => navigate("/")} >Login page</button>
        </div>    
      </Menu>
      <GameContainer><Chessboard /></GameContainer>
    </Container>
    </>
  )
};