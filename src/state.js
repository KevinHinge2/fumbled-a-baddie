const STORAGE_KEY = 'fumbledArcadeState';

const reduceMotion = typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const defaultSoundEnabled = reduceMotion ? false : false;

const defaults = {
  location: 'UNKNOWN SECTOR',
  manualLocation: '',
  scheduleISO: '',
  logoutAttempts: 0,
  soundEnabled: defaultSoundEnabled,
  motionEnabled: !reduceMotion,
  showCharactersMobile: false,
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export { defaults };
