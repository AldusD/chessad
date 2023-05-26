import styled from "styled-components";
import { BiSearchAlt } from "react-icons/bi";

export const UserPageStyles = styled.div`
  max-height: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const UserData = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  background-color: #00000080;
  height: 36vh;
  padding-left: 2rem;
  margin-bottom:10vh;

  span {
    margin-left: 1rem;
    color: white;
    font-size: 2.8rem;
  }

  img {
    border-radius: 4vh;
    height: 20vh;
  }
`;

export const GamesContainer = styled.div`
  background-color: #00000080;
  border: 2px #E4E4E4 solid;
  border-radius: 4vh;
  margin: 0 2rem;
  height: 40vh;
`;

export const Search = styled.div`  
  display: flex;
  flex-direction: column;
  align-items: left;
  padding: 2vh 0;
  justify-content: left;
  margin-left: 1rem;

  > div {
    width: 40vw;
    display: flex;
    align-items: center;

    input {
      border-radius: 4vh;
      height: 3.6vh;
      border: none;
      background-color: #FFF;
      margin: 0.4vh 0 0 0.4rem;
      font-weight: 600;
      padding-left: 0.4rem;
    }

    :nth-child(2) {
      span {
        color: darkred;
      }
    }
  }

  span {
    color: whitesmoke;
  }
`;

export const MagnifierIcon = styled(BiSearchAlt)`
  font-size: 1.3rem;
  margin: 0.4vh 0 0 0.2rem;
  color: #fff;
`;

export const GameHall = styled.div`
  height: 28vh;
  width: 100%;
  border-radius: 0vh;
  overflow: auto;

  ::-webkit-scrollbar {
    width: 0.4rem;
    }

  ::-webkit-scrollbar-track {
    background: #00000000;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 1vh;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  
  .games-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF80;
    height: 6vh;
    margin: 1vh 1rem;
    border-radius: 2vh;

    :hover {
      background-color: #FFFF00CC;
      color: white;
    }

    span {
      display: flex;
      justify-content: center;
      margin: 0 1rem;
      font-size: 0.8rem;
      font-weight: bold;
    }
   }

  a {
    text-decoration: none;
  }
`;
