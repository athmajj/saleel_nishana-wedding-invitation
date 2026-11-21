import React, { useEffect, useRef, useState } from 'react';
import { CONFIG } from './config';
import OpeningCover from './components/OpeningCover';
import GoldDivider from './components/GoldDivider';
import Countdown from './components/Countdown';
import MusicPlayer from './components/MusicPlayer';
import RevealSection from './components/RevealSection';
import ScrollCue from './components/ScrollCue';
import { downloadCalendarEvent } from './utils/calendar';
import { AmbientSynth } from './utils/ambientAudio';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [coverMounted, setCoverMounted] = useState(true);
  const [muted, setMuted] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop'); // default to 'desktop' card view

  const audioElRef = useRef(null);
  const synthRef = useRef(null);
  const petalsRef = useRef(null);

  useEffect(() => {
    if (!isOpened) {
      document.body.classList.add('lock');
    } else {
      document.body.classList.remove('lock');
    }
    return () => {
      document.body.classList.remove('lock');
    };
  }, [isOpened]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  const initPetals = () => {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const p = petalsRef.current;
    if (!p || p.children.length > 0) return;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('i');
      const z = 8 + Math.random() * 8;
      const x = Math.random() * 100;
      s.style.cssText = `--x:${x}%;width:${z}px;height:${z * 1.3}px;--o:${0.3 + Math.random() * 0.35};--dx:${(Math.random() - 0.5) * 35}%;--rot:${180 + Math.random() * 360}deg;animation-duration:${14 + Math.random() * 10}s;animation-delay:${Math.random() * 12}s`;
      fragment.appendChild(s);
    }
    p.appendChild(fragment);
    p.classList.add('show');
  };

  const startMusic = () => {
    if (CONFIG.MUSIC_SRC) {
      if (!audioElRef.current) {
        const audio = new Audio(CONFIG.MUSIC_SRC);
        audio.loop = true;
        audio.volume = CONFIG.MUSIC_VOLUME;
        audioElRef.current = audio;
      }
      audioElRef.current.play().catch(() => {
        if (!synthRef.current) {
          synthRef.current = new AmbientSynth(CONFIG.MUSIC_VOLUME);
        }
        synthRef.current.start();
      });
    } else {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth(CONFIG.MUSIC_VOLUME);
      }
      synthRef.current.start();
    }
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    startMusic();
    initPetals();
    setTimeout(() => {
      setCoverMounted(false);
    }, 1300);
  };

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (audioElRef.current) {
      if (nextMuted) {
        audioElRef.current.pause();
      } else {
        audioElRef.current.play().catch(() => {});
      }
    }
    if (synthRef.current) {
      synthRef.current.setMuted(nextMuted);
    }
  };

  const handleShareWhatsApp = (e) => {
    e.preventDefault();
    const siteUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
    const shareText = `With the blessings of our families, we warmly invite you to celebrate the wedding of Adv. Saleel Nelliyali & Nishana Sherin on Saturday, 12 December 2026.\n\n💌 Digital Invitation:\n${siteUrl}\n\n📍 Venue Location:\nhttps://maps.app.goo.gl/VqfJzfvG8rgnvQBaA`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`app-viewport preview-mode-${previewMode}`}>
      {/* DESKTOP PREVIEW SWITCHER (Appears on desktop screen for testing both mobile and desktop) */}
      <aside className="preview-switcher-bar" aria-label="Device Preview Switcher">
        <span className="preview-switcher-title">View Mode:</span>
        <button
          type="button"
          className={`preview-tab-btn ${previewMode === 'mobile' ? 'active' : ''}`}
          onClick={() => setPreviewMode('mobile')}
        >
          📱 Mobile View (390px)
        </button>
        <button
          type="button"
          className={`preview-tab-btn ${previewMode === 'desktop' ? 'active' : ''}`}
          onClick={() => setPreviewMode('desktop')}
        >
          💻 Desktop Card (540px)
        </button>
      </aside>

      {/* Falling soft petals layer */}
      <div id="pt" ref={petalsRef} aria-hidden="true" />

      {/* FIRST PAGE: Names in Rustic Roadway + Open Invitation Button */}
      {coverMounted && <OpeningCover onOpen={handleOpenInvitation} />}

      {/* Floating Music Toggle Button */}
      <MusicPlayer
        visible={isOpened}
        muted={muted}
        onToggle={handleToggleMute}
      />

      {/* ================================================================
          MAIN INVITATION INTERFACE:
          Centered inside template-bg across all pages, single column flow,
          no SN monogram after opening cover.
          ================================================================ */}
      <main className={`main-flow ${isOpened ? 'main-visible' : ''}`}>
        {/* ----------------------------------------------------------------
            SECTION 1: HERO & BLESSINGS
            ---------------------------------------------------------------- */}
        <section className="pg template-bg hero-section" id="hero">
          <div className="section-inner">
            <RevealSection delay={50}>
              <p className="arabic-text hero-bismillah">{CONFIG.bismillah}</p>
            </RevealSection>

            <RevealSection delay={150}>
              <p className="hero-translation">{CONFIG.quranTranslation}</p>
              <p className="verse-ref">{CONFIG.quranRef}</p>
            </RevealSection>

            <RevealSection delay={280} className="hero-names-wrap">
              <h1 className="hero-names font-rustic">
                <span>{CONFIG.groom.name}</span>
                <span className="hero-amp">&amp;</span>
                <span className="hero-bride-name">{CONFIG.bride.name}</span>
              </h1>
            </RevealSection>

            <RevealSection delay={380}>
              <p className="hero-tagline">
                {CONFIG.eventDay}, {CONFIG.eventDateNum} {CONFIG.eventMonth} {CONFIG.eventYear}
                <br />
                {CONFIG.venueName}, {CONFIG.venuePlace}
              </p>
            </RevealSection>
          </div>

          {/* Scroll Down Suggestion to Section 2 */}
          <ScrollCue targetId="wedding" />
        </section>

        {/* ----------------------------------------------------------------
            SECTION 2: THE COUPLE & FAMILIES (SINGLE COLUMN)
            ---------------------------------------------------------------- */}
        <section className="pg template-bg couple-section" id="wedding">
          <div className="section-inner">
            <RevealSection>
              <p className="section-preamble">{CONFIG.blessingsIntro}</p>
            </RevealSection>

            {/* Groom with Highlighted Parents */}
            <RevealSection delay={150} className="person-block">
              <div className="big font-rustic">{CONFIG.groom.name}</div>
              <div className="parents-highlight">
                <span className="parents-prefix">{CONFIG.groom.parentsPrefix}</span>
                <strong className="parents-names">{CONFIG.groom.parents}</strong>
              </div>
            </RevealSection>

            {/* Script "And" Divider */}
            <RevealSection delay={250} className="div-wrap">
              <div className="div">
                <span className="script font-rustic">And</span>
              </div>
            </RevealSection>

            {/* Bride with Highlighted Parents */}
            <RevealSection delay={350} className="person-block">
              <div className="big font-rustic">{CONFIG.bride.name}</div>
              <div className="parents-highlight">
                <span className="parents-prefix">{CONFIG.bride.parentsPrefix}</span>
                <strong className="parents-names">{CONFIG.bride.parents}</strong>
              </div>
            </RevealSection>
          </div>

          {/* Scroll Down Suggestion to Section 3 */}
          <ScrollCue targetId="date" />
        </section>

        {/* ----------------------------------------------------------------
            SECTION 3: SAVE THE DATE (ATTRACTIVE, CATCHY & MINIMAL)
            ---------------------------------------------------------------- */}
        <section className="pg template-bg date-section" id="date">
          <div className="section-inner">
            <RevealSection>
              <h2 className="script script-heading font-rustic">
                {CONFIG.saveTheDateLabel}
              </h2>
            </RevealSection>

            {/* Catchy Luxury Calendar Date Spotlight */}
            <RevealSection delay={150}>
              <div className="catchy-calendar-card">
                <div className="cal-top-ribbon">
                  <span>{CONFIG.eventMonth} {CONFIG.eventYear}</span>
                </div>
                <div className="cal-main-date">
                  <span className="cal-number">{CONFIG.eventDateNum}</span>
                  <span className="cal-weekday font-rustic">{CONFIG.eventDay}</span>
                </div>
              </div>
            </RevealSection>

            {/* Catchy Highlighted Reception Time Banner */}
            <RevealSection delay={230}>
              <div className="catchy-reception-card">
                <div className="reception-icon-ring">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="reception-text-group">
                  <span className="reception-label-mini">RECEPTION TIME</span>
                  <span className="reception-time-bold">{CONFIG.eventTimeRange}</span>
                </div>
              </div>
            </RevealSection>

            {/* Sleek Highlighted Countdown */}
            <RevealSection delay={320} className="countdown-wrap">
              <Countdown />
            </RevealSection>

            {/* Add to Calendar Button */}
            <RevealSection delay={400} className="calendar-action-wrap">
              <button
                type="button"
                className="btn-cal-action"
                onClick={downloadCalendarEvent}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Add to Calendar</span>
              </button>
            </RevealSection>
          </div>

          {/* Scroll Down Suggestion to Section 4 */}
          <ScrollCue targetId="location" />
        </section>

        {/* ----------------------------------------------------------------
            SECTION 4: LOCATION & VENUE (ATTRACTIVE, CATCHY & MINIMAL)
            ---------------------------------------------------------------- */}
        <section className="pg template-bg venue-section" id="location">
          <div className="section-inner">
            <RevealSection>
              <span className="tag-minimal">VENUE &amp; LOCATION</span>
            </RevealSection>

            <RevealSection delay={150}>
              <h2 className="script venue-title font-rustic">{CONFIG.venueName}</h2>
              <p className="venue-town">{CONFIG.venuePlace}</p>
            </RevealSection>

            {/* Catchy Highlighted Reception Time Banner */}
            <RevealSection delay={230}>
              <div className="catchy-reception-card">
                <div className="reception-icon-ring">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="reception-text-group">
                  <span className="reception-label-mini">RECEPTION TIME</span>
                  <span className="reception-time-bold">{CONFIG.eventTimeRange}</span>
                </div>
              </div>
            </RevealSection>

            {/* Catchy Get Location Button with Maps Link */}
            <RevealSection delay={310}>
              <a
                className="btn btn-location catchy-btn"
                id="map"
                href={CONFIG.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                <span>{CONFIG.mapButtonLabel}</span>
              </a>
            </RevealSection>
          </div>

          {/* Scroll Down Suggestion to Section 5 */}
          <ScrollCue targetId="closing" />
        </section>

        {/* ----------------------------------------------------------------
            SECTION 5: DU'A, CLOSING & WHATSAPP INVITATION (NO MONOGRAM)
            ---------------------------------------------------------------- */}
        <section className="pg template-bg closing-section" id="closing">
          <div className="section-inner">
            <RevealSection>
              <p className="arabic-text dua-arabic">{CONFIG.duaArabic}</p>
              <p className="dua-translation">{CONFIG.duaTranslation}</p>
            </RevealSection>

            <RevealSection delay={150}>
              <p className="closing-invite-msg">{CONFIG.closingInvite}</p>
            </RevealSection>

            <RevealSection delay={230}>
              <GoldDivider floral />
            </RevealSection>

            <RevealSection delay={300}>
              <p className="closing-wishes-msg">{CONFIG.closingWish}</p>
            </RevealSection>

            {/* Groom and Bride Name (instead of family names) */}
            <RevealSection delay={380} className="closing-couple-block">
              <h2 className="closing-couple-title font-rustic">
                {CONFIG.closingCoupleTitle}
              </h2>
            </RevealSection>

            {/* WhatsApp Invitation Share Button */}
            <RevealSection delay={460} className="whatsapp-action-wrap">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  CONFIG.whatsappShareMessage
                )}`}
                onClick={handleShareWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                aria-label="Share on WhatsApp"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>{CONFIG.whatsappButtonLabel}</span>
              </a>
            </RevealSection>
          </div>
        </section>
      </main>
    </div>
  );
}
