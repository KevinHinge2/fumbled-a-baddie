export function trapFocus(container) {
  const selectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[href]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  const focusables = Array.from(container.querySelectorAll(selectors));
  if (!focusables.length) return () => {};

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  const onKeydown = (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  container.addEventListener('keydown', onKeydown);
  first.focus();

  return () => container.removeEventListener('keydown', onKeydown);
}

export function applyMotionState(root, enabled) {
  root.classList.toggle('motion-off', !enabled);
}

export function buttonPulse(button, motionEnabled) {
  if (!motionEnabled) return;
  button.classList.remove('click-pop');
  void button.offsetWidth;
  button.classList.add('click-pop');
  setTimeout(() => button.classList.remove('click-pop'), 180);
}
