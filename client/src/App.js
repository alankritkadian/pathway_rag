import './App.css';
import ChatWindow from './components/chatWindow/ChatWindow';
import Hero from './components/landingPage/firstSection/Hero';
import LandingPage from './components/landingPage/LandingPage';
import Navbar from './components/landingPage/navbar/navbar';
import StarsCanvas from './components/landingPage/StarBackground';
import { LogoTicker } from './components/LogoTicker/logoTicker';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/chat" element={<ChatWindow/>} />
    </Routes>
  );
}

export default App;
