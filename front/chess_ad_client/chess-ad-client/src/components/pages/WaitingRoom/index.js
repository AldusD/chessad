import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useGetGameByPath } from "../../../hooks/api/useGameSetting";
import { useGame } from "../../../contexts/GameContext";
import Header from "../../Header";
import { WaitingRoomStyles } from "./styles";
import Guest from '../../../assets/guest.jpg';
import LoadingQueen from '../../../assets/loading-queen.png';
import { Loading } from "../../comons/styles";
import { useEffect } from "react";

export default function WaitingRoom() {
  const { gameSettings } = useGame();
  const API = process.env.REACT_APP_API_BASE_URL;
  const gamePath = useParams().gamePath;
  //const socket = io(API);

  const {
    mutate: getGameSettings,
    data: gameSettingData
  } = useGetGameByPath();

  useEffect(() => {
    getGameSettings(gamePath);
    //socket.on("connect", () => {
      //console.log('client-side', socket.id); 
    //});
  }, [])
  
  return (
    <WaitingRoomStyles>
      <Header />
      <main>
        <img src={gameSettingData?.game.user.profilePicture || Guest} />
        {gameSettingData ? 
          <span>
            {gameSettingData.game.user.username} • {' '}
            {gameSettingData.game.time} + {gameSettingData.game.increment} • {' '}
            {gameSettingData.game.side}
          </span> : <></>
        }
        <div><p>Waiting an honored opponent</p><Loading size={'10vh'} src={LoadingQueen} /></div>
      </main>
    </WaitingRoomStyles>
  )

};