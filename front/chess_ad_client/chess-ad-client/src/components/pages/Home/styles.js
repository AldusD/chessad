import styled from "styled-components";

export const HomeStyles = styled.div`
  max-height: 100%;
  height: 100vh;

  h2, h3 {
   color: white;
   font-family: 'raleway';
  }

  h2 {
    font-size: 1.6rem;
    margin-bottom: 1vh;
  }
  
  h3 {
    font-size: 1rem;
   }
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 14vh 4rem 0 4rem;
`;

export const GameHallStyles = styled.div`
  height: 70vh;
  width: 40rem;
  background-color: #00000080;
  border: 4px #E4E4E4 solid;
  border-radius: 1rem;
`;

export const GameFormStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00000080;
  width: 30rem;
  height: 50vh;
  padding-bottom: 5vh;
  border: 4px #E4E4E4 solid;
  border-radius: 1rem;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 4vh;
    border: none;
    border-radius: 0.4rem;
    background-color: yellow;
    margin-top: 4vh;
    color: black;
    font-size: 1rem;
    font-weight: 600;

    :hover {
      background: #BF0;
    }
  }
`;

export const CreateForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;  

  form {
    max-width: 20rem;
  }

  input {
    text-align: center;
  }

  button {
    width: 4rem;
    height: 5vh;
    border-radius: 8px;
    border: none;
    margin: 1vh 0.6rem;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 700;

    :hover {
        transform: scale(1.1);
    }
  }  

  span {
    font-size: 0.9rem;
    color: white;
    margin: 0 -1rem 0 1rem;
  }

  .big {
      font-size: 1.2rem;
      margin: 0 -1rem;
  }

  > div {
    display: flex;
    width: 70%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`;

export const Options = styled.div`
  button:nth-child(${props => props.selected}) {
    background-color: yellow;
    color: black;
  }

  .time {
      background-color: black;
      color: white;
    }
`;

export const SideButton = styled.button`
  background-color: ${props => props.bg};
  color: ${props => props.color};
`;

export const Game = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height 10vh;
  background-color: #DDDDDD80;
  margin: 0.4vh 0;
  border-radius: 0.2rem;

  :hover {
    background-color: #FFFF0080;
  }

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 20%;
    margin-right: 0.4rem;
  }

  img {
    height: 7vh;
    margin: 0 0.6rem;
    border-radius: 10vh;
  }

  span {
    color: black;
    font-size: 1rem;
    font-weight: bold;
  }
`;

export const SideBall = styled.div`
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 1rem;
  background-image: ${props => `linear-gradient(to right,  ${props.color}, ${props.color2})`};
  margin: 0 0.6rem;
`;

export const Label = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 1rem 0 3rem;
  color: white;
  font-size: 1rem;
  font-weight: bold;

  > div {
    display: flex;
    justify-content: space-between;
    width: 20%;
  }
`;
