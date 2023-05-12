import styled from "styled-components";

export const FormStyles = styled.form`
    display: flex;
    flex-direction: ${props => props.direction};
    align-items: center;

    input {
      box-sizing: border-box;
      width: ${props => props.inputSize};
      height: 4vh;
      border-radius: 8px;
      border: none;
      margin: 0.4rem 0;
      font-size: 0.9rem;
      font-family: 'Raleway';
      font-weight: 400;
      padding-left: 0.4rem;

      ::-webkit-outer-spin-button, ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      ::placeholder {
      display: flex;
      align-items: left;
      justify-content: center;
      font-size: 1rem;
      font-family: 'Raleway';
      font-weight: 400;
      color: #555;
      }
       
      :focus {
        outline: none;
      }
    }

    button {
      width: 70%;
      height: 5vh;
      border-radius: 8px;
      border: none;
      margin: 0.4rem 0;
      padding: 0 2rem;  
      font-size: 1rem;
      font-weight: 700;   
      background-color: #333;
      color: white;
    }

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
`;

export const FieldError = styled.p`
  font-size: 0.8rem;
  color: yellow;
  font-family: 'Raleway';
  margin: 0;
  text-align: center;
  width: ${props => props.width};
`;

export const Loading = styled.img`
  height: ${props => props.size};
  animation: spin 2s linear infinite;
  
  @keyframes spin {
    0% {
      transform: rotateY(0turn);
    }

    100% {
      transform: rotateY(1turn);
    }
  }
`;