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

  h3 {

  }
`;

export const Search = styled.div`  
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2vh 0;
  justify-content: left;
  margin-left: 1rem;

  > div {
    display: flex;
    align-items: center;
    width: 30%;
  }

  span {
    color: whitesmoke;
  }
`;

export const MagnifierIcon = styled(BiSearchAlt)`
  font-size: 1rem;
  color: whitesmoke
`;
