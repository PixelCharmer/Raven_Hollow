import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/GameStart.scss";

import introBg from "../assets/backgrounds/intro_bg.png";

export default function GameStart() {
    const navigate = useNavigate();

    useEffect(() => {
        // (Optional) preload Room 1 background for a smoother transition
        const img = new Image();
        img.src = "/src/assets/backgrounds/room1_bg.png";
    }, []);

    return (
        <div className="game-start" style={{ backgroundImage: `url(${introBg})` }}>
            <div className="scrim" />
            <div className="content">
                <h1 className="title">The Lantern Gate</h1>
                <p className="narration">
                    Five haunted lanterns guard the way forward. Each flame is bound to a
                    tale whispered by the Hollow spirits. Only by lighting them in the right
                    order will the gate open. But one lantern is cursed—touch it, and shadows
                    lash back.
                </p>

                <div className="whispers">
                    Ghostly whispers braid through the corn—lullabies, warnings, chants,
                    moonstruck songs...
                </div>

                <button
                    className="cta"
                    onClick={() => navigate("/room1")}
                    aria-label="Begin at the Lantern Gate"
                >
                    Enter the Gate
                </button>
                <div className="whispers">
                    <br />
                    ⚠️Please be advised that this escape room contains spooky and unsettling elements. Viewer discretion is advised
                </div>
            </div>
        </div>
    );
}

