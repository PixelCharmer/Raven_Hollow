import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room2Intro.scss";

import room2IntroBg from "../assets/backgrounds/room2intro_bg.png";

const Room2Intro = () => {
    const navigate = useNavigate();

    return (
        <div className="room2-intro" style={{ backgroundImage: `url(${room2IntroBg})` }}>
            <div className="intro-overlay">
                <h1>The Hollow Diary</h1>
                <p>
                    You find torn pages from the Hollow family's journal scattered along a dirt path.
                    The ink seems to shift, revealing symbols instead of letters. A cipher wheel
                    rumored to match these markings lies hidden nearby. Decode the entries and uncover
                    the Keeper's weakness.
                </p>

                <button className="enter-btn" onClick={() => navigate("/room2")}>
                    Enter the Clearing
                </button>
            </div>
        </div>
    );
};

export default Room2Intro;
