import { useEffect, useState } from "react"
import { useGame } from "../../contexts/GameContext";
import GameOptions from "./GameOptions";
import { Data } from "./styles"

export default function PlayerData ({ profilePicture, username, color, showOptions, isAnalysisBoard, initialTime }) {
  const { gameStatus, STATUS, gameSettings } = useGame();
  const [score, setScore] = useState('0');
  const [time, setTime] = useState(initialTime);

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
          { showOptions ? <GameOptions isAnalysisBoard={isAnalysisBoard} color={color} /> : <></> }
        </div>
        <div className="clock"><span>{ time ? `${time}:00` : '3:00' }</span></div>
      </Data>
  )
}