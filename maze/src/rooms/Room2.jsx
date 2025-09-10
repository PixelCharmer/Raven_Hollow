import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room2.scss";

// Backgrounds & overlays
import room2Bg from "../assets/backgrounds/room2_bg.png";
import jumpscareOverlay from "../assets/backgrounds/jumpscare_overlay.png";

// Room 2 elements
import scarecrowImg from "../assets/game_elements/room2/scarecrow.png";
import page1Img from "../assets/game_elements/room2/journal_page1.png";
import page2Img from "../assets/game_elements/room2/journal_page2.png";
import page3Img from "../assets/game_elements/room2/journal_page3.png";
import page4Img from "../assets/game_elements/room2/journal_page4.png";

// Two-ring cipher assets
import cipherOuter from "../assets/game_elements/room2/cipher_outer.svg"; // symbols
import cipherInner from "../assets/game_elements/room2/cipher_inner.svg"; // letters

// util
const toUpperAZ = (s) => (s || "").toUpperCase().replace(/[^A-Z]/g, "");

// content
const PAGES = {
    1: { id: 1, title: "Page 1", image: page1Img, word: "CURSE", symbols: "■♠☄☾●" },
    2: { id: 2, title: "Page 2", image: page2Img, word: "KEEPER", symbols: "✧●●☂●☄" },
    3: { id: 3, title: "Page 3", image: page3Img, word: "FIRE", symbols: "○★☄●" },
    4: { id: 4, title: "Page 4", image: page4Img, word: "FLAME", symbols: "○✪◆✫●" },
};

const CORRECT_ANSWERS = { 1: "CURSE", 2: "KEEPER", 3: "FIRE", 4: "FLAME" };

// small UI
const Node = ({ left, top, label, onClick, disabled = false, seen = false, className = "" }) => (
    <button
        className={`node ${className} ${seen ? "seen" : ""}`}
        style={{ left, top }}
        onClick={onClick}
        aria-label={label}
        title={label}
        disabled={disabled}
    >
        <span className="pulse" />
    </button>
);

const Modal = ({ open, onClose, children, wide = false }) => {
    if (!open) return null;
    return (
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
            <div className={`modal ${wide ? "wide" : ""}`} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};

// cipher wheel
const CipherWheel = () => {
    // start at 69.2 degrees
    const [rotation, setRotation] = useState(69.2);
    const step = 360 / 26; // ~13.846 per letter

    const rotate = (dir) => setRotation((r) => r + dir * step);

    return (
        <div className="cipher-panel">
            <div className="wheel-img-wrap">
                <img src={cipherOuter} alt="Outer Symbols Ring" className="wheel-outer" />
                <img
                    src={cipherInner}
                    alt="Inner Letters Ring"
                    className="wheel-inner"
                    style={{ transform: `rotate(${rotation}deg)` }}
                />
                <div className="wheel-controls">
                    <button onClick={() => rotate(-1)} aria-label="Rotate Left">⟲</button>
                    {/* label hidden by request */}
                    <button onClick={() => rotate(1)} aria-label="Rotate Right">⟳</button>
                </div>
            </div>
        </div>
    );
};

const PageViewer = ({ page }) => (
    <div className="page-viewer">
        <div className="page-img-wrap">
            <img src={page.image} className="page-img" alt={page.title} />
        </div>
        <div className="page-meta">
            <h2>{page.title}</h2>
            <div className="encoded">
                <div className="label">Encoded word:</div>
                <div className="symbols">{page.symbols}</div>
            </div>
            <p className="hint">Decode the journal pages to find the weakness</p>
        </div>
    </div>
);

const AnswerPanel = ({ answers, setAnswers, onVerify, solved }) => {
    const onEdit = (id, v) => setAnswers((a) => ({ ...a, [id]: toUpperAZ(v) }));
    const allFilled = [1, 2, 3, 4].every((i) => (answers[i] || "").length > 0);

    return (
        <div className="answer-panel">
            <h2>Enter the Four Words</h2>
            <p className="muted">Decode the journal pages</p>

            <div className="grid">
                <div className="field">
                    <label>Page 1</label>
                    <input
                        inputMode="latin"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck="false"
                        className="caps"
                        value={answers[1] || ""}
                        onChange={(e) => onEdit(1, e.target.value)}
                        placeholder="DECODE"
                    />
                </div>
                <div className="field">
                    <label>Page 2</label>
                    <input
                        inputMode="latin"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck="false"
                        className="caps"
                        value={answers[2] || ""}
                        onChange={(e) => onEdit(2, e.target.value)}
                        placeholder="DECODE"
                    />
                </div>
                <div className="field">
                    <label>Page 3</label>
                    <input
                        inputMode="latin"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck="false"
                        className="caps"
                        value={answers[3] || ""}
                        onChange={(e) => onEdit(3, e.target.value)}
                        placeholder="DECODE"
                    />
                </div>
                <div className="field">
                    <label>Page 4</label>
                    <input
                        inputMode="latin"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck="false"
                        className="caps"
                        value={answers[4] || ""}
                        onChange={(e) => onEdit(4, e.target.value)}
                        placeholder="DECODE"
                    />
                </div>
            </div>

            <div className="actions">
                <button className="verify" disabled={!allFilled || solved} onClick={onVerify}>
                    {solved ? "Solved!" : "Verify"}
                </button>
            </div>

            {solved && (
                <div className="success">
                    <strong>Correct.</strong> The pages align the Keeper's power frays at the edges. The path opens...
                </div>
            )}
        </div>
    );
};

const Room2 = () => {
    const navigate = useNavigate();

    const [openPageId, setOpenPageId] = useState(null);
    const [openCipher, setOpenCipher] = useState(false);
    const [openAnswerPanel, setOpenAnswerPanel] = useState(false);
    const [answers, setAnswers] = useState({ 1: "", 2: "", 3: "", 4: "" });
    const [seenPages, setSeenPages] = useState({ 1: false, 2: false, 3: false, 4: false });
    const [showJumpscare, setShowJumpscare] = useState(false);
    const [solved, setSolved] = useState(false);

    // gate: require viewing all pages once
    const gateAnswerUntilSeenAll = true;
    const allSeen = Object.values(seenPages).every(Boolean);
    const canAnswer = !gateAnswerUntilSeenAll || allSeen;

    const onOpenPage = (id) => {
        setOpenPageId(id);
        setSeenPages((s) => ({ ...s, [id]: true }));
    };

    const onVerify = () => {
        const allCorrect = Object.entries(CORRECT_ANSWERS).every(
            ([k, v]) => toUpperAZ(answers[k]) === v
        );
        if (allCorrect) {
            setSolved(true);
            setTimeout(() => navigate("/room3intro"), 7000);
        } else {
            setShowJumpscare(true);
            setTimeout(() => setShowJumpscare(false), 650);
        }
    };

    return (
        <div className="room2" style={{ backgroundImage: `url(${room2Bg})` }}>
            {/* decoration */}
            <img src={scarecrowImg} alt="" aria-hidden="true" className="scarecrow-bg" />

            {/* INDIVIDUAL NODES */}
            <Node
                className="cipher-node"
                left="87.8%"
                top="46%"
                label="Inspect Stump (Cipher Wheel)"
                onClick={() => setOpenCipher(true)}
                seen={openCipher}
            />

            <Node
                className="page1-node"
                left="26%"
                top="89%"
                label="Examine Page 1"
                onClick={() => onOpenPage(1)}
                seen={seenPages[1]}
            />

            <Node
                className="page2-node"
                left="70.5%"
                top="72%"
                label="Examine Page 2"
                onClick={() => onOpenPage(2)}
                seen={seenPages[2]}
            />

            <Node
                className="page3-node"
                left="36%"
                top="69%"
                label="Examine Page 3"
                onClick={() => onOpenPage(3)}
                seen={seenPages[3]}
            />

            <Node
                className="page4-node"
                left="60%"
                top="79%"
                label="Examine Page 4"
                onClick={() => onOpenPage(4)}
                seen={seenPages[4]}
            />

            <Node
                className="answer-node"
                left="49%"
                top="54%"
                label={canAnswer ? "Submit the four words" : "Find all pages first"}
                onClick={() => canAnswer && setOpenAnswerPanel(true)}
                disabled={!canAnswer}
                seen={allSeen}
            />

            {/* Modals */}
            <Modal open={openCipher} onClose={() => setOpenCipher(false)} wide>
                <h2>Hidden Cipher Wheel</h2>
                <p className="muted">Rotate until north faces east.</p>
                <CipherWheel />
            </Modal>

            <Modal open={!!openPageId} onClose={() => setOpenPageId(null)} wide>
                {openPageId && <PageViewer page={PAGES[openPageId]} />}
            </Modal>

            <Modal open={openAnswerPanel} onClose={() => setOpenAnswerPanel(false)} wide>
                {canAnswer ? (
                    <AnswerPanel
                        answers={answers}
                        setAnswers={setAnswers}
                        onVerify={onVerify}
                        solved={solved}
                    />
                ) : (
                    <div className="answer-panel">
                        <h2>Almost there…</h2>
                        <p className="muted">Enter the decoded text from each page</p>
                        <ul>
                            <li>Page 1 {seenPages[1] ? "✓" : "—"}</li>
                            <li>Page 2 {seenPages[2] ? "✓" : "—"}</li>
                            <li>Page 3 {seenPages[3] ? "✓" : "—"}</li>
                            <li>Page 4 {seenPages[4] ? "✓" : "—"}</li>
                        </ul>
                    </div>
                )}
            </Modal>

            {/* wrong attempt overlay */}
            {showJumpscare && (
                <div className="jumpscare">
                    <img src={jumpscareOverlay} alt="" aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

export default Room2;
