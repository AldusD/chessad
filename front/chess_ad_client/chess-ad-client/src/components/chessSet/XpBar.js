import { useEffect, useState } from "react";
import styled from "styled-components";

export default function XpBar ({ name, xp, xpBarrier, refresh }) {
  const [filled, setFilled] = useState();
  const type = (name[0] != 'p') ? name.slice(1) : name.slice(2);
  const invalidType = (type === 'Pawn' || type === 'King' || type === 'Zombie' || type === 'Broken');
  useEffect(() => {
    setFilled(`${7 - ((xp / xpBarrier * 7))}vh`);
  }, [refresh])   
  
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
  position: absolute;
  right: 0.25rem;
  
  .filled {
  content: '';
  height: ${props => props.fill};
  width: 1vh;
  background-color: darkred;
  }
`;