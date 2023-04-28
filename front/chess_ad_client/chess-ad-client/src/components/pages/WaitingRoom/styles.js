import styled from "styled-components";

export const WaitingRoomStyles = styled.div`
  height: 100vh;
  background-color: #040404;

  span {
    font-size: 1.8rem;
    color: white;
    font-weight: bold;
  }

  main {
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;

    > img {
      height: 28vh;
      border-radius: 1vh;
    }

    > div { 
      display: flex;
      align-items: center;
    }

    p {
      color: white;
      font-size: 1rem;
    }
  }
`;