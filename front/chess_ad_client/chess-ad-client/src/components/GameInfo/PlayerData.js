import { useEffect, useState, useRef } from "react"
import { useGame } from "../../contexts/GameContext";
import GameOptions from "./GameOptions";
import { useSocket } from "../../contexts/SocketContext"; 
import { Data } from "./styles"

export default function PlayerData ({ profilePicture, username, color, showOptions, isAnalysisBoard, initialTime }) {
  const { gameStatus, STATUS, gameSettings, playersTimes } = useGame();
  const [score, setScore] = useState('0');
  const [time, setTime] = useState((initialTime) ? initialTime * 60 * 1000 : false);
  const timer = useRef();
  const { socket } = useSocket();

  const convertTime = (timestamp) => {
    if (timestamp <= 0) {
      stopTimer();
      socket.emit("position", { playerToken: localStorage.getItem("playerToken") });
      return '00:00';
    }

    const totalSeconds = Math.floor(timestamp / 1000);
    const minutes = (Math.floor(totalSeconds / 60));
    const stringMinutes = (minutes < 10) ? `0${minutes}` : `${minutes}`;
    const seconds = totalSeconds % 60;
    const stringSeconds = (seconds < 10) ? `0${seconds}` : `${seconds}`;
    return `${stringMinutes}:${stringSeconds}`;
  }
  
  const startTimer = () => {
    if (!playersTimes || playersTimes.turn != color) return;
    timer.current = setInterval(() => {
      if (time > 0) setTime((curr) => curr - 900);
    }, 900);
  }

  const stopTimer = () => {
    clearInterval(timer.current);
    timer.current = 0;
  }

  useEffect(() => {
    if (playersTimes?.whitePlayerTime && playersTimes?.blackPlayerTime) {
      stopTimer();
      setTime(playersTimes[`${color}PlayerTime`]);
      startTimer();
    }
  }, [playersTimes])
  
  useEffect(() => {
    const points = (gameStatus === color) ? 1 : (gameStatus === STATUS.TIE) ? '1/2' : '0';
    setScore(points);
    if (gameStatus != STATUS.ONGOING) stopTimer();
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
        <div className="clock"><span>{ time ? convertTime(time) : '3:00' }</span></div>
      </Data>
  )
}