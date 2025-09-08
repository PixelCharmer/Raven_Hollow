import { useNavigate } from "react-router-dom";
import "./../styles/Room5.scss";

// ✅ make sure this file exists at src/assets/backgrounds/room5_bg.png
import bg from "../assets/backgrounds/room5_bg.png";

export default function Room5() {
    const nav = useNavigate();

    return (
        <div className="room5" style={{ backgroundImage: `url(${bg})` }}>
            {/* Clues are always visible on this page */}
            <aside className="clue-panel">
                <h2>Resolve for each digit</h2>
                <ul className="clue-list">
                    <li>Double 5, then remove 3</li>
                    <li>Product of 3 and 2</li>
                    <li>Add 9 to 6 roll back 7</li>
                    <li>Double up on 2</li>
                </ul>
            </aside>

            {/* Clickable node that opens the lock page */}
            <button
                className="node-open-lock"
                onClick={() => nav("/room5-lock")}
                aria-label="Open the combo lock"
                title="Open the combo lock"
            />
        </div>
    );
}
