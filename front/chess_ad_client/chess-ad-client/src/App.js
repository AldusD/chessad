import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './components/pages/MainPage';
import HowToPlay from './components/pages/HowToPlay';
import Home from './components/pages/Home';
import Game from './components/pages/Game';
import WaitingRoom from './components/pages/WaitingRoom';
import { GameProvider } from "./contexts/GameContext";
import { UserProvider } from './contexts/UserContext';
import { QueryClientProvider, QueryClient } from 'react-query';

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <QueryClientProvider client={queryClient} >
      <UserProvider>
      <GameProvider>
        <BrowserRouter >
          <Routes>
            <Route path='/' element={ <MainPage /> } />
            <Route path='/howtoplay' element={ <HowToPlay /> } />
            <Route path='/home' element={ <Home /> } />
            <Route path="/games/join/:gamePath" element={ <WaitingRoom /> } />
            <Route path='*' element={ <span>Not Found :/</span> } />
          </Routes>
        </BrowserRouter>
      </GameProvider>
      </UserProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
