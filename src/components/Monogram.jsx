import React from 'react';
import { CONFIG } from '../config';
import snMonogramImg from '../assets/sn-monogram.png';

export default function Monogram({ size = 'md', className = '' }) {
  const src = CONFIG.customMonogramSrc || snMonogramImg;

  return (
    <div
      className={`monogram-wrap monogram-${size} ${className}`}
      aria-label={`${CONFIG.monogramLeft} & ${CONFIG.monogramRight} Monogram`}
    >
      <img
        src={src}
        alt={`${CONFIG.monogramLeft} & ${CONFIG.monogramRight} Monogram`}
        className="monogram-img"
        loading="lazy"
      />
    </div>
  );
}
