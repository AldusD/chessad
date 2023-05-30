import styled from "styled-components";
import { IoIosArrowDown } from "react-icons/io";
import { AiFillYoutube } from "react-icons/ai";
import { HiOutlineNewspaper } from "react-icons/hi";
import { GiBrazilFlag } from "react-icons/gi";
import { FaFlagUsa } from "react-icons/fa";

export const Container = styled.div`
  min-height: 85vh;
  padding-bottom: 2vh;

  h1 {
    text-align: left;
    margin: 5vh  0 6vh 4vw;
    color: #EEE;
    font-size: 2rem;
    font-weight: bold;
  }
`;

export const Section = styled.div`
  position: relative;
  background-color: #191919;
  border-radius: 3vh;
  margin: 0 4vw;
  margin-bottom: ${props => (props.open) ? "54vh" : "4vh" };

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1vh 1vw;
  }

  h2 {
    color: #EEE;
    font-size: 1.4rem;
    font-weight: bold;
  }
`;

export const SectionParagragh = styled.div`
  background-color: #191919;
  position: absolute;
  top: 10vh;
  left: 0;
  height: 50vh;
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-radius: 0 0 2vh 2vh;

  a {
    text-decoration: none;
    color: whitesmoke;
    font-weight: bold;
  }

  #us-icons-row {
    margin-bottom: 1.4vh;
  }

  > div {
    display: flex;
    justify-content: space-between;
    height: 80%;
    padding: 0 6vw;
  }

  p {
    color: whitesmoke;
    font-size: 1rem;
  }

  span {
    color: whitesmoke;
    font-size: 1rem;
    text-align: left;
  }

  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 44%;
  }
`;

export const DownArrow = styled(IoIosArrowDown)`
  color: white;
  font-size: 6vh;
  cursor: pointer;
  transform: rotate(${props => props.rotation + 'deg'});

  :hover {
    scale: 1.2;
  }
`;

export const YtIcon = styled(AiFillYoutube)`
  margin-left: 0.4rem;
  margin-bottom: -0.6vh;
  font-size: 1.2rem;
  color: whitesmoke;
`;

export const NewsIcon = styled(HiOutlineNewspaper)`
  margin-left: 0.4rem;
  margin-bottom: -0.4vh;
  font-size: 1.2rem;
  color: whitesmoke;
`;

export const BrIcon = styled(GiBrazilFlag)`
  margin-right: 0.4rem;
  margin-bottom: -0.4vh;
  font-size: 1.2rem;
  color: whitesmoke;
`;

export const UsIcon = styled(FaFlagUsa)`
  margin-right: 0.4rem;
  margin-bottom: -0.4vh;
  font-size: 1.2rem;
  color: whitesmoke;
`;

export const RuleImg = styled.img`
  height: ${props => props.size};
  margin-top: 1vh;
  border-radius: 2vh;
`;
