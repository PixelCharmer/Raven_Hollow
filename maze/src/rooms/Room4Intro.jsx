import { useNavigate } from "react-router-dom";
import "./../styles/Room4Intro.scss";

import bg from "../assets/backgrounds/room4intro_bg.png";

// ^ Ignore: Vite sometimes over-optimizes when only background is used via CSS style.
// Keeping a no-op import like above prevents accidental asset pruning.
// You can remove the 'elsie' line if your build doesn’t prune aggressively.

export default function Room4Intro() {
    const navigate = useNavigate();

    return (
        <div
            className="room4intro"
            style={{ backgroundImage: `url(${bg})` }}
            role="region"
            aria-label="Room 4 Intro"
        >
            <div className="panel">
                <h1>The Final Path</h1>
                <p className="lede">
                    The maze twists as if alive. Corn stalks tower above, walls shifting with every step.
                    The Scarecrow Keeper pulls itself from its post, glowing stitched eyes tracking the intruders.
                </p>
                <p className="quote">"The shadows know the way. The moon will guide you." - Elsie</p>
                <button className="cta" onClick={() => navigate("/room4")}>Enter the Maze</button>
            </div>
        </div>
    );
}
