// src/rooms/GameExit.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/GameExit.scss";
import bgExit from "../assets/backgrounds/gameexit_bg.png";

// Fallback credits (always safe to render)
const DEFAULT_CREDITS = [
    { title: "Raven Hollow: Corn Maze Escape" },
    { title: "Story Line", names: ["Laura Leach"] },
    { title: "Puzzle Design", names: ["Laura Leach & Kari Alcoset"] },
    { title: "Code & Gameplay", names: ["Kari Alcoset"] },
];

function normalizeCredits(input) {
    const list = Array.isArray(input) && input.length ? input : DEFAULT_CREDITS;
    return list.map((blk, i) => {
        const title =
            typeof blk?.title === "string" && blk.title.trim() ? blk.title : `Section ${i + 1}`;
        const namesRaw = blk?.names;
        const names = Array.isArray(namesRaw)
            ? namesRaw.filter(Boolean).map(String)
            : typeof namesRaw === "string" && namesRaw.trim()
                ? [namesRaw]
                : [];
        return { title, names };
    });
}

export default function GameExit({
    heading = "You Escaped!",
    subheading = "The gate swings open and the night exhales...",
    showSparkles = true,
    autoScroll = true,
    scrollDurationSec = 28,
    credits, // optional override
}) {
    const navigate = useNavigate();
    const creditsRef = useRef(null);
    const SAFE_CREDITS = normalizeCredits(credits);

    useEffect(() => {
        const el = creditsRef.current;
        if (!el || !autoScroll) return;
        let paused = false;
        const onKey = (e) => {
            if (e.code === "Space" || e.code === "Enter") {
                paused = !paused;
                el.style.animationPlayState = paused ? "paused" : "running";
            }
            if (e.key.toLowerCase() === "r") navigate("/");
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [autoScroll, navigate]);

    return (
        <div
            className="game-exit"
            style={{ backgroundImage: `url(${bgExit})` }}
            role="region"
            aria-label="Game complete and rolling credits"
        >
            {/* Banner */}
            <div className="exit-banner">
                <h1 className="exit-title">{heading}</h1>
                <p className="exit-subtitle">{subheading}</p>
            </div>

            {/* Credits viewport */}
            <div className="credits-viewport">
                {/* Rolling credits */}
                <div
                    ref={creditsRef}
                    className={`credits-roll ${autoScroll ? "auto" : ""}`}
                    style={{ ["--rollDuration"]: `${scrollDurationSec}s` }}
                >
                    {SAFE_CREDITS.map((block, i) => (
                        <section className="credits-block" key={i}>
                            <h2 className="credits-heading">{block.title}</h2>
                            <ul className="credits-names">
                                {block.names.map((n, j) => (
                                    <li key={j}>{n}</li>
                                ))}
                            </ul>
                        </section>
                    ))}

                    <div className="the-end">THE END</div>
                </div>

                {/* Fixed feedback link that stays visible */}
                <div className="feedback-block">
                    <h2 className="credits-heading">Log Your Groups Exit Time</h2>
                    <div className="credits-names">
                            <a
                                href="https://forms.gle/46N758CCxdXQK1gR7"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Click here to log your time
                            </a>
                    </div>
                </div>
            </div>
            {showSparkles && <div className="sparkle-layer" aria-hidden="true" />}
        </div>
    );
}
