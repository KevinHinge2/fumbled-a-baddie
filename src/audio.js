let ctx;

function ensureContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, duration = 0.1, type = 'square', gain = 0.06, delay = 0) {
  const audioCtx = ensureContext();
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
  amp.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + delay + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

  osc.connect(amp);
  amp.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime + delay);
  osc.stop(audioCtx.currentTime + delay + duration + 0.02);
}

export function createAudio(stateRef) {
  const play = (pattern) => {
    if (!stateRef().soundEnabled) return;
    const audioCtx = ensureContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    pattern();
  };

  return {
    hover: () => play(() => tone(640, 0.05, 'triangle', 0.035)),
    click: () => play(() => tone(420, 0.08, 'square', 0.06)),
    confirm: () => play(() => {
      tone(392, 0.08, 'square', 0.06);
      tone(523, 0.11, 'triangle', 0.07, 0.07);
    }),
    error: () => play(() => {
      tone(185, 0.15, 'sawtooth', 0.08);
      tone(150, 0.15, 'sawtooth', 0.07, 0.1);
    }),
    canAutoplayLikely: () => {
      try {
        const audioCtx = ensureContext();
        return audioCtx.state === 'running';
      } catch {
        return false;
      }
    },
  };
}
