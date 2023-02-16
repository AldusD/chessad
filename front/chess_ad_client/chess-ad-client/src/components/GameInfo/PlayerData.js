import { useEffect, useState } from "react"
import { useGame } from "../../contexts/GameContext";
import GameOptions from "./GameOptions";
import { Data } from "./styles"

export default function PlayerData ({ profilePicture, username, color, showOptions }) {
    const { gameStatus, STATUS } = useGame();
    const [score, setScore] = useState('0');
    useEffect(() => {
      const points = (gameStatus === color) ? 1 : (gameStatus === STATUS.TIE) ? '1/2' : '0';
      setScore(points);
    }, [gameStatus])
    return (
        <Data>
          <div>
            <div className="user" >
              <div className="score" >{score}</div>
              <img  src={profilePicture} alt={username} />
              <span>{username}</span>
            </div>
            { showOptions ? <GameOptions /> : <></> }
          </div>
          <div className="clock"><span>3:00</span></div>
        </Data>
    )
}