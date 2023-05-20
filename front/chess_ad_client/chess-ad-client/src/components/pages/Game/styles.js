import styled from "styled-components";

export const GamePageStyles = styled.div`
  position: relative;
  height: 100vh;
`;

export const GameContainer = styled.div`
  margin: 3vh 20% 0 20%;
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

export const GameResult = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  right: 15vh;
  top: 25vh;
  height: 30vh;
  width: 15rem;
  background-color: #FFFFFF60;
  border-radius: 6vh;
  padding: 2vh 0;

  span {
    color: white;
    font-weight: 600;
    font-size: 1.2rem;
  }

  button {
    border: none;
    background-color: transparent;
    color: white;
    font-size: 1rem;
  }

  img {
    height: 10vh;
    width: 10vh;
    border-radius: 4vh;
  }
`;
