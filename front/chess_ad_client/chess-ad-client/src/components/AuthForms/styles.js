import styled from "styled-components";

export const FormContainer = styled.div`
    > p {
        color: white;
        font-family: 'Raleway';
        font-size: 1.2rem;
        text-align: center;
    }

    a {
        text-decoration: none; 
    }
`;

export const Space = styled.div`
    display: flex;
    width: 100%;
    margin-bottom: ${props => `${props.size}vh`};

`;