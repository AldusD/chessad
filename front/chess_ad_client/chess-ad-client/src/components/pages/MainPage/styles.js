import styled from "styled-components";

export const PageStyle = styled.div`
  display: flex;
  align-items: center;
  max-height: 100%;
`;

export const Menu = styled.div`
  height: 100vh;
  margin-right: 4rem;
  background-color: black;

  img {
    margin: 5vh 0;
    width: 20vw;
  }
`;

export const GameContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 73%;
  
  .data-container {
    height: 80vh;
    margin-left: 0.4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;