import { useEffect, useState } from "react";
import { Bar } from './styles';
import { ACTIVE_TIME, PIECES } from "./enums";

export default function XpBar (props) {
  const { name, xp, xpBarrier, refresh, timeLeft } = props;
  const [xpFilled, setXpFilled] = useState();
  const [fadeFilled, setFadeFilled] = useState();
  const type = (name[0] != 'p') ? name.slice(1) : name.slice(2);
  const invalidType = (type === PIECES.PAWN || type === PIECES.KING);
  const fadingType = (type === PIECES.ZOMBIE || type === PIECES.BROKEN);
  const activePowerKnight = (type === PIECES.KNIGHT && (timeLeft > 0));
  useEffect(() => {
    setXpFilled(`${7 - ((xp / xpBarrier * 7))}vh`);
    
    if (fadingType || activePowerKnight) {
      console.log(type)
      const fadingTime = (ACTIVE_TIME[type.toUpperCase()] - 1);
      console.log(timeLeft)
      setFadeFilled(`${7 - ((timeLeft / fadingTime * 7))}vh`);
      console.log(fadingTime)
    }
  }, [refresh])   
  
  return (
    <>
      {(!invalidType && !fadingType) ?  
        <Bar fill={xpFilled} color="green" bgColor="darkred" ><div className="filled" ></div></Bar>
        :
        <></>
      }
      {(fadingType || activePowerKnight) ? 
        <Bar fill={fadeFilled} color="blue" bgColor="darkblue" ><div className="filled" ></div></Bar>
        :
        <></>
      }
    </>
  )
}
