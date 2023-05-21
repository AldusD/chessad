import { FiFlag } from "react-icons/fi"
import { FaRegHandshake } from "react-icons/fa";
import styled from "styled-components";

export const Data = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  > div {
    max-width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user {
    display: flex;
    align-items: center;

    span {
      margin-left: 0.2rem;
      font-size: 1.4rem;
      color: white;
    }

    img {
      height: 7vh;
      width: 7vh;
      border-radius: 0.4rem;
    }
  
    .score {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 0.4rem;
      width: 5vh;
      height: 5vh;
      border-radius: 0.3rem;
      background-color: #88888880;
      color: white;
      font-size: 1rem;
    }
  }

  .clock {
    max-width: 100%;
    background-color: #88888880;
    height: 7vh;
    width: 5rem;
    border-radius: 0.4rem;
    margin: 0 1rem;
    
    span {
      max-width: 100%;
      color: white;
      font-size: 1.4rem;
    }
  }
`;

export const ResignButton = styled(FiFlag)`
    padding: 0.3rem 0.5rem;
    background-color: #c00;
    border-radius: 1rem;
    font-size: 1.4rem;
    margin: 0 0.2rem;
    margin-left: 0.8rem;

    :hover {
      background-color: #F00;
    }
`;

export const OfferDrawButton = styled(FaRegHandshake)`
    padding: 0.2rem 0.4rem;
    background-color: lightgreen;
    border-radius: 1rem;
    font-size: 1.6rem;
    margin: 0 0.2rem;

    :hover {
      background-color: green;
    }
`;

export const Options = styled.div`
  display: flex;
`;

export const DrawOfferResponses = styled.div`
  margin-left: 1rem;
  background-color: #22DD22;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.4rem;
  font-size: 0.8rem;
  border-radius: 2vh;
  font-weight: 500;
  
  > span {
    padding: 1vh 0;
  }

  > div {
    display: flex;
    justify-content: space-between;

    > span {
      background-color: greenyellow;
      margin: 0 0.2rem;
      padding: 0.2rem;
      border-radius: 1vh;
      cursor: pointer;
      font-size: 0.7rem;
    }

    > span:hover {
      background-color: #004499;
      color: #AAFFAA;
    }
  }`
