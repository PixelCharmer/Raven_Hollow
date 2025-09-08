import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room3Intro.scss";

import introBg from "../assets/backgrounds/room3intro_bg.png";
import elsieIdle from "../assets/game_elements/room3/elsie_idle.png";

const Room3Intro = () => {
    const navigate = useNavigate();

    const handleBegin = () => {
        navigate("/room3");
    };

    return (
        <div className="room3intro" style={{ backgroundImage: `url(${introBg})` }}>
            <img className="elsie" src={elsieIdle} alt="Elsie Hollow" />

            <div className="intro-copy">
                <p>
                    <em>
                        At the crossroads of the maze, no sign will guide you. Only riddles
                        whispered by the dead can point the way. Solve them, and the maze
                        will yield its secret. Fail... and you will wander in circles until dawn.
                    </em>
                </p>
                <button className="begin-btn" onClick={handleBegin}>
                    Enter the Crossroads
                </button>
            </div>

            {/* Optional: click-anywhere to begin */}
            <button
                aria-label="Begin"
                className="screen-hotspot"
                onClick={handleBegin}
            />
        </div>
    );
};

export default Room3Intro;
