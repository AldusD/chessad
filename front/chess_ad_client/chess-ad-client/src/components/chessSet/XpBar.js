import { useEffect, useState } from "react";
import styled from "styled-components";

export default function XpBar ({ name, xp, xpBarrier }) {
  const [filled, setFilled] = useState();
  const type = (name[0] != 'p') ? name.slice(1) : name.slice(2);
  const invalidType = (type === 'Pawn' || type === 'King');
  useEffect(() => {
    setFilled(`${7 - ((xp / xpBarrier * 7))}vh`);
    console.log(filled, xp, xpBarrier)
  }, [invalidType])   
  
  return (
    <>
      {invalidType ? 
        <></> 
        : 
        <Bar fill={filled} ><div className="filled" ></div></Bar>
      }
    </>
  )
}

const Bar = styled.div`
  height: 7vh;
  width: 1vh;
  background-color: green;
  z-index: 1;
  margin-right: 1vh;
  
  .filled {
  content: '';
  height: ${props => props.fill};
  width: 1vh;
  background-color: darkred;
  }
`;