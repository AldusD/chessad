import Styled from "styled-components";

export const FormStyles = Styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;

    input {
        box-sizing: border-box;
        width: 70%;
        height: 4vh;
        border-radius: 8px;
        border: none;
        margin: 0.4rem 0;

        font-size: 1rem;
        font-family: 'Raleway'
        font-weight: 400;
        padding-left: 1.6rem;
    }

    input::placeholder {
        display: flex;
        align-items: left;
        justify-content: center;
        font-size: 1rem;
        font-family: 'Raleway'
        font-weight: 400;
        color: #555;
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


`;

export const FormContainer = Styled.div`
    p {
        color: white;
        font-family: 'Raleway';
        font-size: 1.2rem;
        text-align: center;
    }

    a {
        text-decoration: none; 
    }
`;

export const Space = Styled.div`
    display: flex;
    width: 100%;
    margin-bottom: ${props => `${props.size}vh`};

`;