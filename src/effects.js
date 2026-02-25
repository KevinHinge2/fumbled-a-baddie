export function triggerScreenShake(el) {
  el.classList.remove('screen-shake');
  void el.offsetWidth;
  el.classList.add('screen-shake');
}

export function triggerGlitch(el, intense = false) {
  el.classList.remove('glitching');
  if (intense) el.classList.add('glitch-intense');
  void el.offsetWidth;
  el.classList.add('glitching');
  setTimeout(() => el.classList.remove('glitching'), 600);
}

export function trapFocus(modal) {
  const focusables = modal.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return () => {};
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  const onKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  modal.addEventListener('keydown', onKeyDown);
  first.focus();
  return () => modal.removeEventListener('keydown', onKeyDown);
}

export function startParallax(leftEl, rightEl, isEnabled) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return () => {};

  const onMove = (event) => {
    if (!isEnabled()) return;
    const beta = Math.max(-20, Math.min(20, event.beta || 0));
    const gamma = Math.max(-20, Math.min(20, event.gamma || 0));
    const tx = gamma * 0.4;
    const ty = beta * 0.25;
    leftEl.style.transform = `translate(${tx}px, ${ty}px)`;
    rightEl.style.transform = `translate(${-tx}px, ${ty}px)`;
  };

  window.addEventListener('deviceorientation', onMove);
  return () => window.removeEventListener('deviceorientation', onMove);
}
