import { useEffect, useState } from "react";
import { UserPageStyles, UserData, GamesContainer, Search, MagnifierIcon } from "./styles";
import Header from "../../Header";
import Guest from "../../../assets/guest.jpg";
import { useUser } from "../../../contexts/UserContext";

export default function UserPage () {
  const userData = useUser().userData;
  const [userSearched, setUserSearched] = useState('Your Games');
  const [openInput, setOpenInput] = useState();
  const [toSearchUser, setToSearchUser] = useState('');


  const handleSearch = () => {
    if (!openInput) return setOpenInput(curr => true);
    console.log(toSearchUser);
    return setOpenInput(curr => false);
  }
  
  useEffect(() => {

  }, [])

  return (
    <UserPageStyles>
      <Header />
      <UserData>
        <img src={userData.profilePicture || Guest} alt={userData.username || 'Guest'} />
        <span>{userData.username}</span>
      </UserData>
      <GamesContainer>
        <Search>
          <span>{userSearched}</span>
          <div>
            <span>Search for other players games</span>
            {openInput ? <input placeholder='Send "all" to all games'></input> : <></>}
            <MagnifierIcon onClick={handleSearch} />
          </div>
        </Search>
      </GamesContainer>
    </UserPageStyles>
  )
}