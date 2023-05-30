import { useEffect } from "react";
import Form from "../../comons/Form";
import Header from "../../Header";
import GameForm from "./GameForm";
import GameHall from "./GameHall";
import { HomeStyles, Container } from "./styles";
import { useGame } from "../../../contexts/GameContext";

export default function Home() {
  const { clearGameStats } = useGame();

  useEffect(() => {
    clearGameStats()
  }, [])

    return (
      <HomeStyles>
        <Header />
          <Container>
            <GameForm />
            <GameHall />
          </Container>
      </HomeStyles>
    )
}