import styled from "styled-components"
import Chessboard from "../chessSet/Chessboard"

export default function MainPage () {
    return (
        <PageStyle>
          <Menu />
          <Chessboard />
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
