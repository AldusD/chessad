import styled from "styled-components";

export const Bar = styled.div`
  height: 7vh;
  width: 1vh;
  background-color: ${props => props.color};
  position: absolute;
  right: 0.25rem;
  
  .filled {
  content: '';
  height: ${props => props.fill};
  width: 1vh;
  background-color: ${props => props.bgColor};
  }
`;

export const SquareStyle = styled.div`
    background-color: ${props => props.color};
    height: 10vh;
    width: 10vh;
    position: relative;

    span {
        font-size: 0.6rem;
    }
`;

export const SelectedFilter = styled.div`
  position: absolute;
  height: 10vh;
  width: 10vh;
  background-color: #fe670080;
`;

export const Filter = styled.div`
  height: 10vh;
  width: 10vh;
  background-color: #6c277b80;
`;

export const PieceContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

export const PieceStyle = styled.div`
  display: flex;
  position: relative;
  height: 10vh;
  width: 10vh;
  background-image: ${props => `url(${props.src})`};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${props => props.size};
  margin-right: 0.2rem;

  div {
    position: absolute;
    font-size: 1rem;
    z-index: 1;
  }  
`;

export const Board = styled.div`
  height: 80vh;
  width: 80vh;
  display: grid;
  grid-template-columns: repeat(8, 10vh);
  grid-template-rows: repeat(8, 10vh);
  background-color: blue;

  button {
    height: 4vh;
    width: 6rem;
    margin-top: 2vh;
    border: none;
    border-radius: 1vh;  
}

.on {
  background-color: green;
  color: yellow;
}

.off {
  background-color: #777;
  color: white;
}  
`;

export const PromotionContainer = styled.div`
  position: absolute;
  right: 1vh;
  top: ${props => `${props.position}vh`};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 3vh;
  height: 33vh;
  width: 8vh;
  background-color: #440044AA;
  z-index: 1;

  img {
    height: 7vh;
    width: 7vh;
    padding: 0.5vh;
    border-radius: 3vh;
  
    :hover {
      background-color: #FFFFFFCC;
    }
  }
`;
