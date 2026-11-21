import { CONFIG } from '../config';

function formatICSDateUTC(isoString) {
  const d = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

export function downloadCalendarEvent() {
  const startUTC = formatICSDateUTC(CONFIG.eventStartISO);
  const endUTC = formatICSDateUTC(CONFIG.eventEndISO);
  const nowUTC = formatICSDateUTC(new Date().toISOString());

  const title = `Wedding: ${CONFIG.groom.name} & ${CONFIG.bride.name}`;
  const description = `With the blessings of our families, join us for the wedding celebration of ${CONFIG.groom.name} & ${CONFIG.bride.name}.\nVenue: ${CONFIG.venueFullAddress}\nMap: ${CONFIG.mapsUrl}`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SaleelNishanaWedding//Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-saleel-nishana-20261212@invitation`,
    `DTSTAMP:${nowUTC}`,
    `DTSTART:${startUTC}`,
    `DTEND:${endUTC}`,
    `SUMMARY:${title}`,
    `LOCATION:${CONFIG.venueFullAddress}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Saleel-Nishana-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
