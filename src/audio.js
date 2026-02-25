let ctx;

function ensure() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, duration = 0.12, type = 'square', gain = 0.08, delay = 0) {
  const c = ensure();
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, c.currentTime + delay);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + delay + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + delay + duration);
  o.connect(g);
  g.connect(c.destination);
  o.start(c.currentTime + delay);
  o.stop(c.currentTime + delay + duration + 0.01);
}

export function createAudio(stateRef) {
  const play = (fn) => {
    if (!stateRef().soundEnabled) return;
    fn();
  };

  return {
    click: () => play(() => tone(420, 0.08, 'square')),
    success: () => play(() => [tone(392, 0.08), tone(523, 0.1, 'triangle', 0.08, 0.08)]),
    error: () => play(() => [tone(190, 0.16, 'sawtooth', 0.09), tone(150, 0.16, 'sawtooth', 0.08, 0.1)]),
    gameOver: () => play(() => [tone(260, 0.4, 'triangle', 0.08), tone(220, 0.6, 'sine', 0.08, 0.25)]),
    warningTick: () => play(() => tone(900, 0.05, 'square', 0.04)),
  };
}
