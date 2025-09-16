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
                    Every Halloween, the town of Raven Hollow hosts a legendary corn maze challenge. This year, the maze has been expanded
                    into the eerie grounds of the old Hollow Farm—abandoned since the mysterious disappearance of the Hollow family decades ago.

                    You and your team of thrill - seekers enter the maze at dusk, eager for adventure. But as the sun sets, the maze begins to shift.
                    Paths rearrange, whispers echo through the stalks, and strange symbols appear on the ground. The exit vanishes. You're trapped...

                    A gust of wind is stirred up and you a ghostly whisper
                </p>

                <div className="whispers">
                    "You must uncover the truth behind the Hollow family's curse to escape. Solve the riddles, unlock the secrets,
                    and beware the Scarecrow Keeper who walks when the moon is high."

                </div>

                <button
                    className="cta"
                    onClick={() => navigate("/room1intro")}
                    aria-label="Begin at the Lantern Gate"
                >
                    Enter the Maze
                </button>
                <div className="whispers">
                    <br />
                    ⚠️Please be advised that this escape room contains spooky and unsettling elements. Viewer discretion is advised
                </div>
            </div>
        </div>
    );
}

