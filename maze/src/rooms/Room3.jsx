import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Room3.scss";

import bg from "../assets/backgrounds/room3_bg.png";
import elsieIdle from "../assets/game_elements/room3/elsie_idle.png";
import sign1 from "../assets/game_elements/room3/signpost1.png";
import sign2 from "../assets/game_elements/room3/signpost2.png";
import sign3 from "../assets/game_elements/room3/signpost3.png";
import sign4 from "../assets/game_elements/room3/signpost4.png";
import riddleBox from "../assets/game_elements/room3/riddle_box.png";

/** Four riddles → one per signpost */
const RIDDLES = [
    {
        key: "lantern",
        prompt: `I glow but am not fire,
I sing but have no mouth.
I guide but never walk.
What am I?`,
        canon: ["lantern", "the lantern"],
    },
    {
        key: "scarecrow",
        prompt: `I stand though I have no legs,
I guard though I have no eyes.
In fields I keep watch —
what am I?`,
        canon: ["scarecrow", "a scarecrow"],
    },
    {
        key: "moon",
        prompt: `I shine but am not fire,
I follow but never lead,
I wax and wane with time —
what am I?`,
        canon: ["moon", "the moon"],
    },
    {
        key: "dawn",
        prompt: `I mark an end and a beginning,
I burn away the night,
but only after shadows fall —
what am I?`,
        canon: ["dawn", "sunrise", "daybreak", "break of day", "day break"],
    },
];

function norm(s) {
    return s.trim().toLowerCase();
}

function matches(canonList, input) {
    const n = norm(input);
    return canonList.some((c) => norm(c) === n);
}

const Room3 = () => {
    const navigate = useNavigate();

    // Solved state per signpost (0..3)
    const [solved, setSolved] = useState([false, false, false, false]);
    // Active riddle index (null when closed)
    const [active, setActive] = useState(null);
    // Input values per riddle
    const [answers, setAnswers] = useState(["", "", "", ""]);
    const [feedback, setFeedback] = useState("");
    const inputRef = useRef(null);

    const allSolved = useMemo(() => solved.every(Boolean), [solved]);

    // Open a riddle when clicking its sign
    const openRiddle = (idx) => {
        setActive(idx);
        setFeedback("");
        // focus after paint
        requestAnimationFrame(() => inputRef.current?.focus());
    };

    // Close current riddle (without solving)
    const closeRiddle = () => {
        setActive(null);
        setFeedback("");
    };

    const onChange = (e) => {
        if (active == null) return;
        const next = [...answers];
        next[active] = e.target.value;
        setAnswers(next);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (active == null) return;

        const a = answers[active];
        if (matches(RIDDLES[active].canon, a)) {
            const nextSolved = [...solved];
            nextSolved[active] = true;
            setSolved(nextSolved);
            setFeedback("Correct.");
            // brief delay so player sees the feedback, then close
            setTimeout(() => {
                setActive(null);
                setFeedback("");
                // if everything is solved, proceed
                if (nextSolved.every(Boolean)) {
                    navigate("/room4intro");
                }
            }, 4000);
        } else {
            setFeedback("Not quite. Listen carefully and try again.");
        }
    };

    return (
        <div className="room3" style={{ backgroundImage: `url(${bg})` }}>
            {/* Character */}
            <img className="elsie" src={elsieIdle} alt="Elsie Hollow" />

            {/* Four signposts — each with unique placement/size via SCSS */}
            <button
                className={`sign sign--one ${solved[0] ? "is-solved" : ""}`}
                style={{ backgroundImage: `url(${sign1})` }}
                onClick={() => openRiddle(0)}
                aria-label="Signpost 1"
            />
            <button
                className={`sign sign--two ${solved[1] ? "is-solved" : ""}`}
                style={{ backgroundImage: `url(${sign2})` }}
                onClick={() => openRiddle(1)}
                aria-label="Signpost 2"
            />
            <button
                className={`sign sign--three ${solved[2] ? "is-solved" : ""}`}
                style={{ backgroundImage: `url(${sign3})` }}
                onClick={() => openRiddle(2)}
                aria-label="Signpost 3"
            />
            <button
                className={`sign sign--four ${solved[3] ? "is-solved" : ""}`}
                style={{ backgroundImage: `url(${sign4})` }}
                onClick={() => openRiddle(3)}
                aria-label="Signpost 4"
            />

            {/* Riddle UI — hidden until a signpost is active */}
            {active !== null && (
                <div
                    className="riddle-ui"
                    style={{ backgroundImage: `url(${riddleBox})` }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="riddlePrompt"
                >
                    <div id="riddlePrompt" className="riddle-text">
                        {RIDDLES[active].prompt.split("\n").map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>

                    <form className="answer-row" onSubmit={onSubmit}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={answers[active]}
                            onChange={onChange}
                            placeholder="type your answer…"
                            autoCapitalize="none"
                            autoCorrect="off"
                            autoComplete="off"
                            spellCheck="false"
                        />
                        <button type="submit" className="submit">Submit</button>
                        <button type="button" className="close" onClick={closeRiddle}>
                            Close
                        </button>
                    </form>

                    <div className="feedback" aria-live="polite">{feedback}</div>
                    <div className="progress">
                        <span className="label">Solved:</span>
                        <span className="sequence">
                            {solved.map((v, i) => (v ? RIDDLES[i].key : "—")).join("  ")}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Room3;
