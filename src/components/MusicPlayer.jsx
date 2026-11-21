import React from 'react';

export default function MusicPlayer({ visible, muted, onToggle }) {
  if (!visible) return null;

  return (
    <button
      id="mu"
      type="button"
      className={`music-btn ${muted ? 'is-muted' : 'is-playing'}`}
      onClick={onToggle}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      title={muted ? 'Play music' : 'Mute music'}
    >
      <span className="music-icon" aria-hidden="true">
        {muted ? '✕' : '♪'}
      </span>
    </button>
  );
}
