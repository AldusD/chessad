import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetGameByPath } from "../../../hooks/api/useGameSetting";
import { useGame } from "../../../contexts/GameContext";
import { useSocket } from "../../../contexts/SocketContext";
import Header from "../../Header";
import Guest from '../../../assets/guest.jpg';
import LoadingQueen from '../../../assets/loading-queen.png';
import { WaitingRoomStyles } from "./styles";
import { Loading } from "../../comons/styles";

export default function WaitingRoom() {
  const { gameSettings } = useGame();
  const gamePath = useParams().gamePath;
  const navigate = useNavigate();
  const { socket } = useSocket();

  const {
    mutate: getGameSettings,
    data: gameSettingData
  } = useGetGameByPath();

  useEffect(() => {
    getGameSettings(gamePath);
    socket.emit("join_game", { playerToken: localStorage.getItem('playerToken') });
  }, [])

  useEffect(() => {
    if (gameSettingData && gameSettingData.error) {
      return navigate('/home');
    }
  }, [gameSettingData])

  useEffect(() => {
    socket.on("join_game", (message) => {
      navigate('/games/play/' + gamePath);
    });

    socket.on("error", (message) => {
      console.log('error listener - ', message)
    })
  }, [socket])
  
  return (
    <WaitingRoomStyles>
      <Header />
      <main>
        {(gameSettingData && !gameSettingData.error) ? <>
          <img src={gameSettingData?.game.user.profilePicture || Guest} />
          <span>
            {gameSettingData.game.user.username} • {' '}
            {gameSettingData.game.time} + {gameSettingData.game.increment} • {' '}
            {gameSettingData.game.side}
          </span></> : <></>
        }
        <div><p>Waiting an honored opponent</p><Loading size={'10vh'} src={LoadingQueen} /></div>
      </main>
    </WaitingRoomStyles>
  )
};