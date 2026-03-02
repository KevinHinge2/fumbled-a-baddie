export function buttonTemplate({ id, label, variant = 'primary', extraClass = '', ariaLabel, type = 'button' }) {
  return `<button id="${id}" type="${type}" class="arcade-btn ${variant} ${extraClass}" aria-label="${ariaLabel || label}">${label}</button>`;
}
