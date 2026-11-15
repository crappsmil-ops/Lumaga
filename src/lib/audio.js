const STORAGE_KEY = "trinkluma_sound_enabled";

let audioCtx = null;

export function isSoundEnabled() {
  return localStorage.getItem(STORAGE_KEY) !== "false";
}

export function setSoundEnabled(enabled) {
  localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
}

function getCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, duration, type = "sine", volume = 0.12) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

function sweep(fromFreq, toFreq, start, duration, type = "square", volume = 0.1) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(fromFreq, ctx.currentTime + start);
  osc.frequency.exponentialRampToValueAtTime(toFreq, ctx.currentTime + start + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration);
}

const SOUNDS = {
  // Spieler ist dran / Challenge wechselt: ascending two-tone blip
  turn: () => {
    tone(523, 0, 0.07, "square", 0.08);
    tone(784, 0.07, 0.09, "square", 0.08);
  },
  // Aufgabe/Frage geschafft: bright chime arpeggio
  success: () => {
    tone(523, 0, 0.07, "triangle", 0.1);
    tone(659, 0.06, 0.07, "triangle", 0.1);
    tone(784, 0.12, 0.1, "triangle", 0.1);
  },
  // Trinken: descending tone
  drink: () => {
    tone(330, 0, 0.09, "sawtooth", 0.09);
    tone(220, 0.08, 0.14, "sawtooth", 0.09);
  },
  // Jokerkarte: playful sweep
  joker: () => {
    sweep(400, 1200, 0, 0.12, "square", 0.08);
    tone(880, 0.1, 0.1, "triangle", 0.08);
  },
  // Spiel beendet: triumphant fanfare
  finish: () => {
    tone(523, 0, 0.09, "triangle", 0.11);
    tone(659, 0.09, 0.09, "triangle", 0.11);
    tone(784, 0.18, 0.09, "triangle", 0.11);
    tone(1047, 0.27, 0.22, "triangle", 0.11);
  },
};

export function playSFX(name) {
  if (!isSoundEnabled()) return;
  try {
    SOUNDS[name]?.();
  } catch (e) {
    // ignore audio errors
  }
}