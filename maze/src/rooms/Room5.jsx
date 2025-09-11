import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room5.scss";

import room5Bg from "../assets/backgrounds/room5_bg.png";

const NODES = [
    {
        id: "thorn-gate",
        title: "Slot 1",
        riddle:
            "At the maze’s end, the iron waits,\nIts crown of points seals shut the gates.\nSharp as teeth, they pierce the sky -\nOnly those who see can pass by.",
        answer: "7",
    },
    {
        id: "hex-harvest",
        title: "Slot 2",
        riddle:
            "Painted on a barn by the edge of the maze,\nA charm against blight and ill-willed gaze.\nSeveral petals circle, warding the night -\nHow many points hold back the fright?",
        answer: "6",
    },
    {
        id: "web-row-end",
        title: "Slot 3",
        riddle:
            "Where moonlight threads and gloom,\nA silver web is strung like loom.\nIts maker waits, both still and sly -\nCount the legs that guard nearby.",
        answer: "8",
    },
    {
        id: "crow-crossroads",
        title: "Slot 4",
        riddle:
            "Where crows debate which way to soar,\nThe path splits clean no more.\nChoose with care or wander more -\nHow many ways from the crossing core?",
        answer: "4",
    },
];

const RiddleModal = ({ open, node, onClose }) => {
    if (!open || !node) return null;
    return (
        <div className="riddle-modal" role="dialog" aria-modal="true">
            <div className="riddle-card">
                <div className="riddle-head">
                    <h2>{node.title}</h2>
                    <button className="close" onClick={onClose} aria-label="Close">✕</button>
                </div>
                <pre className="riddle-text">{node.riddle}</pre>
                <div className="riddle-actions">
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
            <div className="backdrop" onClick={onClose} />
        </div>
    );
};

export default function Room5() {
    const [openNode, setOpenNode] = useState(null);
    const nav = useNavigate();

    return (
        <div className="room5" style={{ backgroundImage: `url(${room5Bg})` }}>
            {/* Riddle nodes */}
            {NODES.map((n) => (
                <div key={n.id} className={`node node--${n.id}`}>
                    <button
                        className="node-btn"
                        onClick={() => setOpenNode(n)}
                        aria-label={n.title}
                        title="Open riddle"
                    >
                        <span className="node-glow" aria-hidden />
                        <span className="node-label" aria-hidden />
                    </button>
                </div>
            ))}

            {/* Clickable node that opens the lock page */}
            <button
                className="node-open-lock"
                onClick={() => nav("/room5-lock")}
                aria-label="Open the combo lock"
                title="Open the combo lock"
            />

            <RiddleModal open={!!openNode} node={openNode} onClose={() => setOpenNode(null)} />
        </div>
    );
}
