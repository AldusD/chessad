import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  padding-top: 4vh;
  height: 96vh;

  img {
    margin: 3vh;
    height: 20vh;
    border-radius: 1vh;
  }
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 10vw;
  width: 30vw;
  
  span {
    display: flex;
    color: white;
    font-weight: 600;
    font-size: 2rem;
    margin-bottom: 4vh;
  }

  > div {
    display: flex;
    margin-top: 10vh;

    button {
      width: 10vw;
      height: 10vh;
      border: none;
      background-color: whitesmoke;
      margin: 1vh;
      border-radius: 2vh;
      color: black;
      font-size: 1.1rem;
      font-weight: 600;

      :hover {
        background-color: black;
        color: whitesmoke;
      }

    }
  }
`;