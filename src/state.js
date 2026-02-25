const STORAGE_KEY = 'fumbledArcadeState';

const defaults = {
  targetTimestamp: null,
  location: 'missing',
  logoutAttempts: 0,
  secondChanceUsed: false,
  secondChanceUnlocked: false,
  soundEnabled: true,
  motionEnabled: true,
  ending: null,
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

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export { defaults };
