import styled from "styled-components"
import Chessboard from "../chessSet/Chessboard"

export default function MainPage () {
    return (
        <PageStyle>
          <Menu />
          <GameContainer>
            <span>data-opponent</span>
            <Chessboard />
            <span>data-me</span>
          </GameContainer>
        </PageStyle>
    )
}

const PageStyle = styled.div`
  display: flex;
  align-items: center;
`;

const Menu = styled.div`
  height: 100vh;
  width: 36rem;
  margin-right: 4rem;
  background-color: grey;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
