import { useEffect, useState } from "react";
import Guest from "../../../assets/guest.jpg";
import LoadingQueen from "../../../assets/loading-queen.png";
import { UserPageStyles, UserData, GamesContainer, Search, MagnifierIcon, GameHall } from "./styles";
import { Loading } from "../../comons/styles";
import Header from "../../Header";
import { useUser } from "../../../contexts/UserContext";
import { useGetGames } from "../../../hooks/api/useGame";

export default function UserPage () {
  const userData = useUser().userData;
  const [userSearched, setUserSearched] = useState('Your');
  const [openInput, setOpenInput] = useState();
  const [toSearchUser, setToSearchUser] = useState('');

  const {
    mutate: requestGames,
    data: gamesData,
    isLoading: gamesLoading
  } = useGetGames()

  const handleSearch = () => {
    if (!openInput) return setOpenInput(curr => true);
    if (!toSearchUser) return setOpenInput(curr => false);
    setOpenInput(curr => false);
    if (toSearchUser.toLowerCase() === 'all') {
      setUserSearched(curr => 'All games');
      setToSearchUser(curr => false);
      return requestGames();
    }
    setToSearchUser(curr => false);
    setUserSearched(curr => toSearchUser);
    requestGames(toSearchUser);
  }
  
  useEffect(() => {
    requestGames(userData.username);
  }, []);

  return (
    <UserPageStyles>
      <Header />
      <UserData>
        <img src={userData.profilePicture || Guest} alt={userData.username || 'Guest'} />
        <span>{userData.username}</span>
      </UserData>
      <GamesContainer>
        <Search>
          <div>
            <span>Search for players games</span>
            {openInput ? <input onChange={(e) => setToSearchUser(curr => e.target.value)} value={toSearchUser} placeholder='Send "all" to all games'></input> : <></>}
            <MagnifierIcon onClick={handleSearch} />
          </div>
          <div>
            <span>{(userSearched === 'Your games' || userSearched === 'All games') ? userSearched : `${userSearched}'s games` }</span>
          </div>
        </Search>
        <GameHall>
          { (gamesLoading) ? <Loading size={'20vh'} src={LoadingQueen} /> : 
              (!gamesData || gamesData.length === 0) ? <div className="games-container" ><span>NO GAMES FOUND :/</span></div> : 
                gamesData.map(game => 
                  <div className="games-container" >
                    <span>{game.whitePlayer.username}</span> 
                    <span>{game.result}</span> 
                    <span>{game.blackPlayer.username}</span>
                  </div>)
          }
        </GameHall>
      </GamesContainer>
    </UserPageStyles>
  )
}