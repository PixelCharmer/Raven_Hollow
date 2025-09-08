import { useEffect, useMemo, useRef, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import "../styles/Room1.scss";

import roomBg from "../assets/backgrounds/room1_bg.png";
import jumpscareOverlay from "../assets/backgrounds/jumpscare_overlay.png";
import cluePage from "../assets/game_elements/room1/clue_journal_page.png";

import lanternBlue from "../assets/game_elements/room1/lantern_blue.png";
import lanternRed from "../assets/game_elements/room1/lantern_red.png";
import lanternGreen from "../assets/game_elements/room1/lantern_green.png";
import lanternYellow from "../assets/game_elements/room1/lantern_yellow.png";
import lanternPurple from "../assets/game_elements/room1/lantern_purple.png";

const ORDER = ["blue", "red", "green", "yellow", "purple"];
const STORIES = {
    blue: "Elsie’s lullaby",
    red: "Scarecrow’s warning",
    green: "Pumpkin chant",
    yellow: "Moon phase",
    purple: "Final whisper",
};

// optional audio hooks (safe if you don't provide files)
const useSfx = () => {
    const okRef = useRef(null);
    const badRef = useRef(null);
    const gateRef = useRef(null);
    useEffect(() => {
        okRef.current = new Audio("/sfx/lantern_ok.mp3");
        badRef.current = new Audio("/sfx/jumpscare.mp3");
        gateRef.current = new Audio("/sfx/gate_unlock.mp3");
    }, []);
    return {
        playOk: () => okRef.current && okRef.current.play().catch(() => { }),
        playBad: () => badRef.current && badRef.current.play().catch(() => { }),
        playGate: () => gateRef.current && gateRef.current.play().catch(() => { }),
    };
};

export default function Room1() {
    const [progress, setProgress] = useState(0);
    const [lit, setLit] = useState({});
    const [showJump, setShowJump] = useState(false);
    const [showClue, setShowClue] = useState(false);
    const [inputLocked, setInputLocked] = useState(false);

    // NEW: showGame — reveals lanterns/decoy only after "Begin Ritual"
    const [showGame, setShowGame] = useState(false);

    // NEW: hint tooltips visibility
    const [openHintId, setOpenHintId] = useState(null);

    const { playOk, playBad, playGate } = useSfx();

    const lanterns = useMemo(
        () => ([
            { id: "green", img: lanternGreen, left: 12, bottom: 10, hue: 120 },
            { id: "purple", img: lanternPurple, left: 28, bottom: 14, hue: 275 },
            { id: "yellow", img: lanternYellow, left: 46, bottom: 16, hue: 52 },
            { id: "blue", img: lanternBlue, left: 64, bottom: 14, hue: 210 },
            { id: "red", img: lanternRed, left: 80, bottom: 10, hue: 0 },
        ]),
        []
    );

    // NEW: hint nodes configuration (positions in % of viewport)
    const hintNodes = useMemo(() => ([
        {
            id: "h1",
            title: "",
            text: "Before the fields stir, a lull drifts where dusk meets water — it begins here.",
            color: "#bde2ff", // blue
            left: 93, top: 16,
        },
        {
            id: "h2",
            title: "",
            text: "Then comes the scarecrow’s breath — sharp, red with warning, cutting the silence.",
            color: "#ff8a8a", // red
            left: 50.5, top: 29,
        },
        {
            id: "h3",
            title: "",
            text: "Midway, the earth hums with roots and gourds — a chant woven in green flame.",
            color: "#62f57d", // green
            left: 27, top: 67,
        },
        {
            id: "h4",
            title: "",
            text: "Later, the sky thins; a pale arc wanes and the yellow grainlight flickers.",
            color: "#f5f562", // yellow
            left: 50.5, top: 10,
        },
        {
            id: "h5",
            title: "",
            text: "At the very end, when night swallows breath, the last whisper drapes itself in violet.",
            color: "#da71f5", // purple
            left: 17, top: 24,
        },
    ]), []);



    // NEW: “Begin Ritual” node (to reveal lanterns)
    const startNode = { id: "start", label: "Begin Ritual", left: 50, top: 68 };

    // NEW: decoy is hidden until showGame
    const [decoyPos] = useState(() => ({
        left: 49 + (Math.random() * 6 - 3),
        top: 38 + (Math.random() * 6 - 3),
    }));

    useEffect(() => {
        setLit({});
        setProgress(0);
    }, []);

    const handleWrong = () => {
        if (inputLocked) return;
        setInputLocked(true);
        setShowJump(true);
        playBad();
        setTimeout(() => {
            setShowJump(false);
            setLit({});
            setProgress(0);
            setInputLocked(false);
        }, 1200);
    };

    const handleClickLantern = (id) => {
        if (!showGame || inputLocked || showClue) return;
        const expected = ORDER[progress];
        if (id !== expected) return handleWrong();

        playOk();
        const nextLit = { ...lit, [id]: true };
        setLit(nextLit);
        const nextProgress = progress + 1;
        setProgress(nextProgress);

        if (nextProgress === ORDER.length) {
            setInputLocked(true);
            setTimeout(() => {
                playGate();
                setShowClue(true);
                setInputLocked(false);
            }, 350);
        }
    };

    const toggleHint = (id) => {
        setOpenHintId((prev) => (prev === id ? null : id));
    };

    const navigate = useNavigate();

    // when clue is revealed:
    useEffect(() => {
        if (showClue) {
            const timer = setTimeout(() => {
                navigate("/room2intro");  // 👈 route path to your Room2Intro component
            }, 4000); // 4s delay for players to see the clue

            return () => clearTimeout(timer);
        }
    }, [showClue, navigate]);



    return (
        <div className="room1" style={{ backgroundImage: `url(${roomBg})` }}>

            {/* NEW: Toggle to close lanterns */}
            {
                showGame && !showClue && (
                    <button
                        className="close-lanterns-btn"
                        onClick={() => {
                            setShowGame(false);
                            setLit({});
                            setProgress(0);
                        }}
                    >
                        Close Lanterns
                    </button>
                )
            }
            {/* NEW: Clickable hint nodes */}
            {hintNodes.map((n) => (
                <div
                    key={n.id}
                    className="node"
                    style={{ left: `${n.left}%`, top: `${n.top}%` }}
                >
                    <button
                        className="node-btn"
                        style={{ "--nodeColor": n.color }}
                        onClick={() => toggleHint(n.id)}
                        aria-label={`${n.title} hint`}
                    >
                        <span className="node-pulse" />
                        <span className="node-core" />
                    </button>

                    {/* Show hint below the node */}
                    {openHintId === n.id && (
                        <div className="node-hint">
                            {n.title ? <h4>{n.title}</h4> : null}
                            <p>{n.text}</p>
                        </div>
                    )}

                </div>
            ))}


            {/* NEW: Start (Begin Ritual) node */}
            {!showGame && (
                <div
                    className="node node-start"
                    style={{ left: `${startNode.left}%`, top: `${startNode.top}%` }}
                >
                    <button
                        className="node-btn start-btn"
                        onClick={() => {
                            setShowGame(true);
                            setOpenHintId(null);
                        }}
                        aria-label="Begin the lantern ritual"
                    >
                        <span className="node-pulse" />
                        <span className="node-core" />
                        <span className="start-label">{startNode.label}</span>
                    </button>
                </div>
            )}

            {/* Lanterns (hidden until showGame) */}
            {showGame && lanterns.map((lantern) => (
                <button
                    key={lantern.id}
                    className={`lantern ${lit[lantern.id] ? "is-lit" : ""}`}
                    style={{ left: `${lantern.left}%`, bottom: `${lantern.bottom}%` }}
                    onClick={() => handleClickLantern(lantern.id)}
                    aria-label={`Lantern ${lantern.id} — ${STORIES[lantern.id]}`}
                    disabled={inputLocked}
                >
                    <img src={lantern.img} alt="" draggable={false} />
                    <span className="glow" style={{ "--hue": lantern.hue + "deg" }} />
                </button>
            ))}

            {/* Decoy (also hidden until showGame) */}
            {showGame && (
                <button
                    className="decoy"
                    style={{ left: `${decoyPos.left}%`, top: `${decoyPos.top}%` }}
                    onClick={handleWrong}
                    aria-label="Cursed shadow"
                    disabled={inputLocked}
                >
                    <span className="wisp" />
                </button>
            )}

            {/* Jump scare */}
            {showJump && (
                <div className="jumpscare" role="alert" aria-live="assertive">
                    <img src={jumpscareOverlay} alt="" />
                </div>
            )}

            {/* Clue reveal */}
            {showClue && (
                <div className="clue" role="dialog" aria-modal="true" aria-label="First clue">
                    <img className="page" src={cluePage} alt="" />
                    <div className="clue-text">
                        <h2>The First Clue</h2>
                        <p>“The Hollow family kept secrets in their journal. Find the pages scattered in the maze.”</p>
                    </div>
                    <div className="actions">
                        <button className="btn" onClick={() => setShowClue(false)}>Close</button>
                        {/* Replace with navigate("/room2") when ready */}
                    </div>
                </div>
            )}
        </div>
    );
}
