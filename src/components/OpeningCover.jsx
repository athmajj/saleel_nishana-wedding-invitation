import React, { useState } from 'react';
import { CONFIG } from '../config';
import snMonogramImg from '../assets/sn-monogram.png';

export default function OpeningCover({ onOpen }) {
  const [opening, setOpening] = useState(false);

  const handleOpenClick = () => {
    if (opening) return;
    setOpening(true);
    onOpen();
  };

  return (
    <div id="intro" className={`intro-cover ${opening ? 'out' : ''}`}>
      <div className="intro-card-frame template-bg">
        <div className="intro-container">
          {/* Subtle Bismillah Header */}
          <p className="intro-bismillah arabic-text">{CONFIG.bismillah}</p>

          {/* Names in Rustic Roadway font */}
          <h1 className="intro-couple-title font-rustic">
            Saleel &amp; Nishana
          </h1>

          {/* Open Invitation Button with S&N Logo Seal */}
          <button
            id="open"
            className={`open-trigger ${opening ? 'gone' : ''}`}
            onClick={handleOpenClick}
            aria-label="Open invitation"
          >
            <span className="seal">
              <img
                src={snMonogramImg}
                alt="S&N"
                className="seal-monogram-thumb"
              />
            </span>
            <span className="lbl">{CONFIG.openButtonLabel}</span>
            <span className="open-tap-cue">Tap to open</span>
          </button>
        </div>
      </div>
    </div>
  );
}
