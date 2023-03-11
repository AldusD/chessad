import Form from "../../comons/Form";
import Header from "../../Header";
import GameForm from "./GameForm";
import { GameHall, HomeStyles, Container } from "./styles";

export default function Home() {
    return (
      <HomeStyles>
        <Header username='Guest' />
          <Container>
            <GameForm />
            <GameHall />
          </Container>
      </HomeStyles>
    )
}