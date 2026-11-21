import React from 'react';
import dividerImg from '../assets/divider.png';

export default function GoldDivider({ floral = false, compact = false, className = '' }) {
  if (floral) {
    return (
      <img
        src={dividerImg}
        alt=""
        className={`dv floral-divider ${className}`}
        loading="lazy"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`gold-divider ${compact ? 'gold-divider-compact' : ''} ${className}`}
      aria-hidden="true"
    >
      <span className="gold-line" />
      <span className="gold-diamond" />
      <span className="gold-line" />
    </div>
  );
}
