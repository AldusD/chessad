import styled from "styled-components";

export const HeaderStyles = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  background-color: #FFFFFFDD;
  height: 10vh;
  box-shadow: 0 1vh 2vh black;

  a {
    text-decoration: none;
  }
    
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 99%;
    margin-right: 10rem;

    > div {
      display: flex;
      align-items: center;
    }

    img {
      height: 6vh;
      border-radius: 0.4vh;
      margin-left: 1rem;
      margin-right: 0.6rem;
    }
  }
`;

export const Item= styled.div`
  font-family: 'raleway';
  font-weight: bold;
  font-size: 1rem;
  color: #111;
  margin: 0 0.6rem;
  padding: 1.6vh 1rem;

  :hover {
    transform: scale(1.2);
    background-color: #000000DD;
    color: #FFFFFF;
    border-radius: 0.6rem;
  }
`;
