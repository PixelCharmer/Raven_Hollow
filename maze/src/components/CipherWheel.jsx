import React, { useState } from "react";
import cipherOuter from "../assets/game_elements/room2/cipher_outer.svg";
import cipherInner from "../assets/game_elements/room2/cipher_inner.svg";

const CipherWheel = () => {
    const [rotation, setRotation] = useState(0);
    const step = 360 / 26; // 26 letters, ~13.85° per step

    const rotate = (dir) => setRotation((r) => r + dir * step);

    return (
        <div className="wheel-wrap">
            {/* Outer symbols stay fixed */}
            <img src={cipherOuter} alt="Outer symbols ring" className="wheel-outer" />

            {/* Inner letters rotate */}
            <img
                src={cipherInner}
                alt="Inner letters ring"
                className="wheel-inner"
                style={{ transform: `rotate(${rotation}deg)` }}
            />

            <div className="wheel-controls">
                <button onClick={() => rotate(-1)}>⟲</button>
                <span>{rotation.toFixed(1)}°</span>
                <button onClick={() => rotate(1)}>⟳</button>
            </div>
        </div>
    );
};

export default CipherWheel;
