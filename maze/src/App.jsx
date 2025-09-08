import { Routes, Route, Navigate } from 'react-router-dom';

import GameStart from './rooms/GameStart.jsx';
import Room1 from './rooms/Room1.jsx';
import Room2Intro from './rooms/Room2Intro.jsx';
import Room2 from './rooms/Room2.jsx';
import Room3Intro from './rooms/Room3Intro.jsx';
import Room3 from './rooms/Room3.jsx';
import Room4Intro from './rooms/Room4Intro.jsx';
import Room4 from './rooms/Room4.jsx';
import Room5 from './rooms/Room5.jsx';
import Room5Lock from "./rooms/Room5Lock.jsx";
import GameExit from './rooms/GameExit.jsx';   

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<GameStart />} />
            <Route path="/room1" element={<Room1 />} />
            <Route path="/room2intro" element={<Room2Intro />} />
            <Route path="/room2" element={<Room2 />} />
            <Route path="/room3intro" element={<Room3Intro />} />
            <Route path="/room3" element={<Room3 />} />
            <Route path="/room4intro" element={<Room4Intro />} />
            <Route path="/room4" element={<Room4 />} />
            <Route path="/room5" element={<Room5 />} />
            <Route path="/room5-lock" element={<Room5Lock />} />
            <Route path="/game-exit" element={<GameExit />} />
        </Routes>
    );
}