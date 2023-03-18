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
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin: 5vh 0;
    width: 20vw;
  }

  a {
    text-decoration: none;
    color: white;
    font-size: 1rem;
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

export const PovButton = styled.div`
  margin: 5vh 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.3rem;
  height: 4vh;
  border-radius: 0.2rem;
  font-size: 0.8rem;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.textColor};
`;

export const ResetButton = styled.div`
  margin-top: 5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.6rem;
  height: 4vh;
  border-radius: 0.2rem;
  font-size: 0.8rem;
  background-color: yellow;
  color: black;
`;

export const Buttons = styled.div`
  display: flex;
`
