import React, { useEffect, useState } from 'react';
import { CONFIG } from '../config';

function getTimeLeft(targetIso) {
  const target = new Date(targetIso).getTime();
  const diff = target - Date.now();
  if (diff <= 0) {
    return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  return {
    done: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(() =>
    getTimeLeft(CONFIG.eventStartISO)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(CONFIG.eventStartISO));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft.done) {
    return (
      <div className="countdown-done">
        <p>{CONFIG.countdownCompleteText}</p>
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="countdown-highlight" role="timer" aria-live="polite">
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="cd-pill">
            <span className="cd-value">{u.value}</span>
            <span className="cd-label">{u.label}</span>
          </div>
          {i < units.length - 1 && <span className="cd-divider">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
