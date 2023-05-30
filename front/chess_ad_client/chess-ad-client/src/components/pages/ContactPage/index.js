import { useNavigate } from "react-router-dom"
import { Container, Menu, InstagramIcon, GmailIcon, LinkedinIcon, GithubIcon } from "./styles"
import Chessboard from "../../ChessSet/Chessboard";
import { GameContainer } from "../Game/styles";
import Header from "../../Header";

export default function ContactPage () {
  const navigate = useNavigate();

  return (
    <>
    <Header type="alternative" />
    <Container>
      <h1>Contact us:</h1>
      <p>
        Hi there, I'm Aldus Daniel a Brazilian fullstack web developer, chess player and creator of Chess Arcane Dynasty.
      </p>
      <p>
        This game is a open source project and has its limitations in which I hope to work to improve (and accept help on doing so!).
        You can contact me for any issue, sugestion or bug as well as see how the project works on the links below.
      </p>
      <div className="column" >
        <a target="blank" href="github.com/aldusd/chessad" ><GithubIcon />ChessAD</a>
        <a target="blank" href="mailto:ChessArcaneDynasty@gmail.com" ><GmailIcon />ChessArcaneDynasty@gmail.com</a>
        <a target="blank" href="github.com/aldusd" ><GithubIcon /></a>
        <a target="blank" href="https://br.linkedin.com/in/aldus-daniel-ferreira-de-souza-monteiro" ><LinkedinIcon /></a>
        <a target="blank" href="instagram.com/aldusdaniel" ><InstagramIcon /></a>
      </div>
    </Container>
    </>
  )
};