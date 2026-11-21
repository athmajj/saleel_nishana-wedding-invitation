import React from 'react';

/**
 * ScrollCue component:
 * Elegant bouncing scroll cue button suggesting the user scroll down to the next section.
 */
export default function ScrollCue({ targetId, label = 'Scroll' }) {
  const handleClick = (e) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      className="scrl"
      href={`#${targetId}`}
      onClick={handleClick}
      aria-label={`Scroll down to ${targetId}`}
    >
      <span>{label}</span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 8l6 6 6-6" />
        <path d="M6 14l6 6 6-6" opacity=".5" />
      </svg>
    </a>
  );
}
