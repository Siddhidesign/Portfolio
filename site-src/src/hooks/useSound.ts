// Tiny WebAudio sound engine: airport chime, clicks, beeps. No audio files needed.
let enabled = false;
let ctx: AudioContext | null = null;
const listeners = new Set<(on: boolean) => void>();

export const sound = {
  get on() { return enabled; },
  toggle() { enabled = !enabled; listeners.forEach((l) => l(enabled)); if (enabled) sound.chime(); },
  subscribe(fn: (on: boolean) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
  tone(freq: number, dur = 0.18, delay = 0, type: OscillatorType = "sine", vol = 0.08) {
    if (!enabled) return;
    ctx ??= new AudioContext();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq; o.connect(g); g.connect(ctx.destination);
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
  },
  chime() { sound.tone(784, 0.6); sound.tone(659, 0.6, 0.35); sound.tone(523, 0.9, 0.7); },
  click() { sound.tone(1400, 0.04, 0, "square", 0.03); },
};
