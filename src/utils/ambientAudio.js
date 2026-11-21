// Gentle, serene pentatonic ambient harp/pad fallback using Web Audio API
// Used automatically if CONFIG.MUSIC_SRC is left empty.

export class AmbientSynth {
  constructor(volume = 0.25) {
    this.ctx = null;
    this.masterGain = null;
    this.timer = null;
    this.isPlaying = false;
    this.volume = volume;
    // Soft D-major pentatonic / serene modal notes
    this.notes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25];
    this.step = 0;
  }

  start() {
    if (this.isPlaying) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume * 0.45;
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this._scheduleLoop();
  }

  _playPluck(freq, duration = 3.2) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 0.5, now);

    const subGain = this.ctx.createGain();
    subGain.gain.value = 0.18;

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.35, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    osc2.connect(subGain);
    subGain.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  _scheduleLoop() {
    const pattern = [0, 2, 3, 5, 4, 3, 2, 1, 0, 3, 4, 6, 5, 3, 2, 0];
    const playNext = () => {
      if (!this.isPlaying) return;
      const idx = pattern[this.step % pattern.length];
      this._playPluck(this.notes[idx], 3.4);
      if (this.step % 4 === 0) {
        this._playPluck(this.notes[0] * 0.5, 4.5);
      }
      this.step += 1;
      this.timer = setTimeout(playNext, 1350);
    };
    playNext();
  }

  setMuted(muted) {
    if (!this.masterGain || !this.ctx) return;
    const target = muted ? 0.0001 : this.volume * 0.45;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.08);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
