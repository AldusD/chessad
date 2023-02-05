import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './components/pages/MainPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter >
        <Routes>
          <Route path='/' element={ <MainPage /> } />
          <Route path='*' element={ <span>Not Found :/</span> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
