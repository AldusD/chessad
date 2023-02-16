import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './components/pages/MainPage';
import { GameProvider } from "./contexts/GameContext";
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <div className="App">
      <UserProvider>
      <GameProvider>
        <BrowserRouter >
          <Routes>
            <Route path='/' element={ <MainPage /> } />
            <Route path='*' element={ <span>Not Found :/</span> } />
          </Routes>
        </BrowserRouter>
      </GameProvider>
      </UserProvider>
    </div>
  );
}

export default App;
