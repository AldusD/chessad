import styled from "styled-components";
import { GrInstagram } from "react-icons/gr";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { SiGmail } from "react-icons/si";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;

  h1 {
    text-align: left;
    margin: 5vh  0 0 4vw;
    color: #EEE;
    font-size: 2rem;
    font-weight: bold;
  }

  p {
    color: whitesmoke;
    font-size: 1rem;
    text-align: left;
    margin: 2vh 12vw 4vh 4vw;
  }

  div {
    display: flex;
    align-items: center;
    margin: 2vh 0 2vh 4vw;

    a {
      text-decoration: none;
      color: whitesmoke;
      font-size: 1rem;
      margin: 0 4vw 0 0;
    }
  }
`;

export const InstagramIcon = styled(GrInstagram)`
  font-size: 2rem;
  color: whitesmoke;
  margin-bottom: -1vh;
`;

export const LinkedinIcon = styled(BsLinkedin)`
  font-size: 2rem;
  color: whitesmoke;
  margin-bottom: -1vh;
`;

export const GmailIcon = styled(SiGmail)`
  font-size: 2rem;
  color: whitesmoke;
  margin-bottom: -1vh;
`;

export const GithubIcon = styled(BsGithub)`
  font-size: 2rem;
  margin-bottom: -1vh;
  color: whitesmoke;
`;
