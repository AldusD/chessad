import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query';
import logo from './logo.svg';
import './App.css';
import MainPage from './components/pages/MainPage';
import UserPage from './components/pages/UserPage';
import HowToPlay from './components/pages/HowToPlay';
import Home from './components/pages/Home';
import Game from './components/pages/Game';
import ViewGamePage from './components/pages/ViewGamePage';
import WaitingRoom from './components/pages/WaitingRoom';
import { GameProvider } from "./contexts/GameContext";
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient} >
      <UserProvider>
      <GameProvider>
      <SocketProvider>
        <BrowserRouter >
          <Routes>
            <Route path='/' element={ <MainPage /> } />
            <Route path='/userPage' element={ <UserPage /> } />
            <Route path='/howtoplay' element={ <HowToPlay /> } />
            <Route path='/home' element={ <Home /> } />
            <Route path="/games/join/:gamePath" element={ <WaitingRoom /> } />
            <Route path="/games/play/:gamePath" element={ <Game /> } />
            <Route path="/games/view/:gamePath" element={ <ViewGamePage /> } />
            <Route path='*' element={ <span>Not Found :/</span> } />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
      </GameProvider>
      </UserProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
