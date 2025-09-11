import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Room4.scss";

import bg from "../assets/backgrounds/room4_bg.png";

// icons provided in game_elements/room4
import shadowLeft from "../assets/game_elements/room4/scarecrow_shadow_left.png";
import shadowRight from "../assets/game_elements/room4/scarecrow_shadow_right.png";
import shadowForward from "../assets/game_elements/room4/scarecrow_shadow_forward.png";

import moonCrescent from "../assets/game_elements/room4/moon_icon_crescent.png";
import moonHalf from "../assets/game_elements/room4/moon_icon_half.png";
import moonFull from "../assets/game_elements/room4/moon_icon_full.png";

// --- Puzzle configuration (4-step sequence) ---
const ANSWER_SEQ = [
    { dir: "right", moon: "half" },
    { dir: "forward", moon: "crescent" },
    { dir: "left", moon: "full" },
    { dir: "forward", moon: "crescent" },
];

// Individually positionable, resizable nodes with their own hint text
const NODES = [
    { id: 1, left: "-3%", top: "66%", hint: "The first half light will always feel right", dot: "10px", hintW: "220px" },
    { id: 2, left: "7%", top: "83%", hint: "With just a sliver of light, the honest path is the straight one", dot: "10px", hintW: "220px" },
    { id: 3, left: "61%", top: "62%", hint: "With the full gaze overhead, choose a new direction", dot: "10px", hintW: "220px" },
    { id: 4, left: "89%", top: "70%", hint: "When the crescent returns, advance without hesitation", dot: "10px", hintW: "220px" },
];

const DIR_CHOICES = [
    { key: "left", label: "Left", img: shadowLeft },
    { key: "forward", label: "Forward", img: shadowForward },
    { key: "right", label: "Right", img: shadowRight },
];

const MOON_CHOICES = [
    { key: "crescent", label: "Crescent", img: moonCrescent },
    { key: "half", label: "Half", img: moonHalf },
    { key: "full", label: "Full", img: moonFull },
];

export default function Room4() {
    const navigate = useNavigate();

    const [step, setStep] = useState(0); // 0..3
    const [selection, setSelection] = useState({ dir: null, moon: null });
    const [visited, setVisited] = useState([]); // indices 0..step-1
    const [status, setStatus] = useState("");
    const [complete, setComplete] = useState(false);

    const [openHints, setOpenHints] = useState(() => NODES.map(() => false));

    const onPick = (type, key) => {
        setStatus("");
        setSelection((prev) => ({ ...prev, [type]: key }));
    };

    const onConfirm = () => {
        if (!selection.dir || !selection.moon) return;
        const correct = ANSWER_SEQ[step];
        const isMatch = selection.dir === correct.dir && selection.moon === correct.moon;

        if (isMatch) {
            setVisited((v) => [...v, step]);
            setSelection({ dir: null, moon: null });

            if (step === ANSWER_SEQ.length - 1) {
                setStatus("The final corridor brightens and a clearing begins to form.");
                setComplete(true);
            } else {
                setStatus("The path extends a little further into the maze...");
                setStep(step + 1);
            }
        } else {
            setStatus("Elsie gestures with a warning. Try another pairing.");
        }
    };

    const onReset = () => {
        setStep(0);
        setSelection({ dir: null, moon: null });
        setVisited([]);
        setStatus("");
        setComplete(false);
        setOpenHints(NODES.map(() => false));
    };

    const goNext = () => navigate("/room5");

    const toggleHint = (idx) => {
        setOpenHints((prev) => {
            const copy = [...prev];
            copy[idx] = !copy[idx];
            return copy;
        });
    };

    const keyToggle = (e, idx) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleHint(idx);
        }
    };

    return (
        <div
            className="room4"
            style={{ backgroundImage: `url(${bg})` }}
            role="region"
            aria-label="Room 4: The Final Path"
        >
            <div className="scene">
                {/* Invisible board (no map / no box). Nodes float over the background. */}
                <div className="board" aria-label="Maze Nodes">
                    {NODES.map((node, idx) => {
                        const reached = visited.includes(idx);
                        const current = idx === step && !complete;
                        const future = idx > step && !complete;
                        const done = complete && idx === NODES.length - 1;

                        return (
                            <div
                                key={node.id}
                                className="node"
                                style={{
                                    left: node.left,
                                    top: node.top,
                                    "--dot": node.dot,
                                    "--hintW": node.hintW,
                                }}
                                data-reached={reached || done ? true : undefined}
                                data-current={current ? true : undefined}
                                data-future={future ? true : undefined}
                            >
                                <div
                                    className="hotspot"
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={openHints[idx] ? "true" : "false"}
                                    aria-label="Maze node hint"
                                    onClick={() => toggleHint(idx)}
                                    onKeyDown={(e) => keyToggle(e, idx)}
                                >
                                    <span className="dot" />
                                </div>

                                <div className="hintbox" data-open={openHints[idx] ? true : undefined}>
                                    <p>{node.hint}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="controls" role="group" aria-label="Choose direction and moon phase">
                    <div className="stepbar">
                        <span>Step {Math.min(step + 1, 4)} / 4</span>
                        {status && <span className="status">{status}</span>}
                    </div>

                    <div className="picker">
                        <h3>Shadow (Direction)</h3>
                        <div className="options" role="radiogroup" aria-label="Direction choices">
                            {DIR_CHOICES.map((opt) => (
                                <button
                                    key={opt.key}
                                    className="option"
                                    type="button"
                                    onClick={() => onPick("dir", opt.key)}
                                    data-selected={selection.dir === opt.key || undefined}
                                    aria-pressed={selection.dir === opt.key}
                                >
                                    <img src={opt.img} alt={opt.label} draggable={false} />
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="picker">
                        <h3>Moon Phase (Timing)</h3>
                        <div className="options" role="radiogroup" aria-label="Moon phase choices">
                            {MOON_CHOICES.map((opt) => (
                                <button
                                    key={opt.key}
                                    className="option"
                                    type="button"
                                    onClick={() => onPick("moon", opt.key)}
                                    data-selected={selection.moon === opt.key || undefined}
                                    aria-pressed={selection.moon === opt.key}
                                >
                                    <img src={opt.img} alt={opt.label} draggable={false} />
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="actions">
                        {!complete ? (
                            <>
                                <button
                                    className="btn"
                                    onClick={onConfirm}
                                    disabled={!selection.dir || !selection.moon}
                                >
                                    Confirm Step
                                </button>
                                <button className="btn btn--ghost" onClick={onReset}>Reset</button>
                            </>
                        ) : (
                            <>
                                <div className="completion">A narrow passage shimmers ahead and freedom beckons.</div>
                                <button className="btn" onClick={goNext}>Continue to the gate</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
