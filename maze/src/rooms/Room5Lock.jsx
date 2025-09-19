import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Room5Lock.scss";

// Moved jumpscare here so it appears on every incorrect attempt
import jumpscareOverlay from "../assets/backgrounds/jumpscare_overlay2.png";

export default function Room5Lock({
    targetCode = "7684",        // change this if you want a different final code
    nextRoute = "/game-exit",   // where to go when correct
    backRoute = "/room5",       // where Back goes
}) {
    const nav = useNavigate();
    const [digits, setDigits] = useState([0, 0, 0, 0]);
    const [status, setStatus] = useState("idle"); // idle | error | success
    const [showJumpscare, setShowJumpscare] = useState(false); // controls overlay

    const codeString = useMemo(() => digits.join(""), [digits]);
    const isCorrect = useMemo(() => codeString === targetCode, [codeString, targetCode]);

    useEffect(() => {
        if (status === "success") {
            const t = setTimeout(() => nav(nextRoute), 800);
            return () => clearTimeout(t);
        }
    }, [status, nav, nextRoute]);

    const bump = (i, delta) =>
        setDigits((prev) => {
            const next = [...prev];
            next[i] = (next[i] + delta + 10) % 10;
            return next;
        });

    const triggerJumpscare = () => {
        // "pop in" immediately, then fade out (handled by CSS)
        setShowJumpscare(true);
        // keep on screen ~2s then hide
        setTimeout(() => setShowJumpscare(false), 2000);
    };

    const submit = () => {
        if (isCorrect) {
            setStatus("success");
        } else {
            setStatus("error");
            triggerJumpscare(); // show every incorrect attempt
            // reset visual error state after a brief shake
            setTimeout(() => setStatus("idle"), 500);
        }
    };

    // basic keyboard support
    useEffect(() => {
        let focusIndex = 0;
        const onKey = (e) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key))
                e.preventDefault();
            if (e.key === "ArrowLeft") focusIndex = (focusIndex + 3) % 4;
            if (e.key === "ArrowRight") focusIndex = (focusIndex + 1) % 4;
            if (e.key === "ArrowUp") bump(focusIndex, +1);
            if (e.key === "ArrowDown") bump(focusIndex, -1);
            if (e.key === "Enter") submit();
            if (e.key === "Escape") nav(backRoute);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [nav, backRoute]);

    return (
        <div className="room5lock">
            <div className={`pad ${status}`} aria-live="polite">
                <h3>Enter 4-Digit Code</h3>

                <div className="digits">
                    {digits.map((d, i) => (
                        <div className="digit" key={i}>
                            <button
                                className="arrow up"
                                onClick={() => bump(i, +1)}
                                aria-label={`Increase digit ${i + 1}`}
                            >
                                ▲
                            </button>
                            <div className="value-wrap">
                                <div className="value-shadow" />
                                <div className="value">{d}</div>
                            </div>
                            <button
                                className="arrow down"
                                onClick={() => bump(i, -1)}
                                aria-label={`Decrease digit ${i + 1}`}
                            >
                                ▼
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pad-actions">
                    <button className="btn back" onClick={() => nav(backRoute)}>
                        Back
                    </button>
                    <button className="btn submit" onClick={submit}>
                        Submit
                    </button>
                </div>

                {status === "error" && <div className="feedback error">Incorrect code. Try again.</div>}
                {status === "success" && <div className="feedback success">Unlocked! Opening gate…</div>}
            </div>

            {/* Jumpscare overlay (pop-in then fade-out) */}
            {showJumpscare && (
                <div className="jumpscare" aria-hidden="true">
                    <img src={jumpscareOverlay} alt="" />
                </div>
            )}
        </div>
    );
}
