import { useEffect, useState } from "react";
import { Bar } from './styles';

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
