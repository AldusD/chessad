import styled from "styled-components";

export const PageStyle = styled.div`
  display: flex;
  align-items: center;
`;

export const Menu = styled.div`
  height: 100vh;
  margin-right: 4rem;
  background-color: black;

  img {
    margin: 5vh 0;
    height: 20vh;
  }
`;

export const GameContainer = styled.div`
  display: flex;
  width: 100%;
  
  .data-container {
    height: 80vh;
    margin-left: 0.4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;