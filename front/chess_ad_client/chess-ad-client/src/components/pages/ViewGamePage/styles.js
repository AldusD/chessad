import styled from "styled-components";

export const GameControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 24vw;
  margin-right: -20vw;
`;

export const PgnContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: left;
  background-color: #00000080;
  width: 20vw;
  height: 26vh;
  padding: 1vh 0.4vw;
  border: 4px #E4E4E4 solid;
  border-radius: 1rem;
  margin-top: 10vh;
  overflow: auto;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: whitesmoke;
    color: black;
    font-size: 0.6rem;
    font-weight: bold;
    padding: 0.4vh 0.2vw;
    margin: 1vh 0.4vw;
    border-radius: 1vh;
  }
  
  ::-webkit-scrollbar {
  width: 0.2rem;
  }

  ::-webkit-scrollbar-track {
    background: #00000000;
  }
  
  ::-webkit-scrollbar-thumb {
    background: whitesmoke;
    border-radius: 1vh;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #AAA;
  }
`;
