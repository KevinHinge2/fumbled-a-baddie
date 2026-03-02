import './styles.css';
import { createAudio } from './audio';
import { applyMotionState, buttonPulse, trapFocus } from './effects';
import { layoutTemplate } from './components/Layout';
import { lockInModalTemplate, logoutModalTemplate } from './components/Modal';
import { loadState, saveState } from './state';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const app = document.querySelector('#app');
const state = loadState();
const audio = createAudio(() => state);

if (prefersReduced && state.motionEnabled) state.motionEnabled = false;
if (!localStorage.getItem('fumbledArcadeState') && !audio.canAutoplayLikely()) state.soundEnabled = false;

let clockInterval;
let glitchInterval;
let releaseFocus = () => {};

function formatNow() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const tz = now.toLocaleTimeString([], { timeZoneName: 'short' }).split(' ').pop();
  return { time, tz };
}

function getNextEvening() {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  if (date.getHours() >= 20) date.setDate(date.getDate() + 1);
  date.setHours(20);
  return date;
}

function showOverlay(message) {
  const overlay = document.querySelector('#overlay');
  overlay.textContent = message;
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 1800);
}

function updateNotice() {
  const dateTimer = document.querySelector('#dateTimer');
  const location = document.querySelector('#location');
  const timeWithZone = document.querySelector('#timeWithZone');
  const attempts = document.querySelector('#attempts');
  const soundToggle = document.querySelector('#soundToggle');
  const motionToggle = document.querySelector('#motionToggle');
  const manualLocation = document.querySelector('#manualLocation');
  const showCharacters = document.querySelector('#showCharacters');

  const { time, tz } = formatNow();
  dateTimer.textContent = time;
  location.textContent = state.location || 'UNKNOWN SECTOR';
  timeWithZone.textContent = `${time} ${tz}`;
  attempts.textContent = String(state.logoutAttempts);
  soundToggle.textContent = `SOUND: ${state.soundEnabled ? 'ON' : 'OFF'}`;
  motionToggle.textContent = `MOTION: ${state.motionEnabled ? 'ON' : 'OFF'}`;
  manualLocation.value = state.manualLocation || '';
  showCharacters.textContent = state.showCharactersMobile ? 'HIDE CHARACTERS' : 'SHOW CHARACTERS';

  document.querySelector('.layout-grid').classList.toggle('show-characters-mobile', state.showCharactersMobile);
}

function scheduleClock() {
  clearInterval(clockInterval);
  const dateTimer = document.querySelector('#dateTimer');
  clockInterval = setInterval(() => {
    const { time } = formatNow();
    dateTimer.textContent = time;
    if (state.motionEnabled) {
      dateTimer.classList.add('jitter');
      setTimeout(() => dateTimer.classList.remove('jitter'), 140);
    }
    const { tz } = formatNow();
    document.querySelector('#timeWithZone').textContent = `${time} ${tz}`;
  }, 1000);
}

function applyGlitchCycle() {
  clearInterval(glitchInterval);
  if (!state.motionEnabled) return;
  const headline = document.querySelector('.hero h1');
  glitchInterval = setInterval(() => {
    if (Math.random() < 0.17) {
      headline.classList.add('headline-glitch');
      setTimeout(() => headline.classList.remove('headline-glitch'), 180);
    }
  }, 5000);
}

function openModal(type) {
  const backdrop = document.querySelector('#modalBackdrop');
  const container = document.querySelector('#modalContainer');
  backdrop.classList.remove('hidden');
  backdrop.setAttribute('aria-hidden', 'false');

  if (type === 'lock') {
    const next = getNextEvening();
    container.innerHTML = lockInModalTemplate(
      state.manualLocation || state.location || 'UNKNOWN SECTOR',
      next.toISOString().slice(0, 10),
      '20:00',
    );

    container.querySelector('#cancelLockIn').addEventListener('click', () => {
      state.logoutAttempts += 1;
      saveState(state);
      closeModal();
      updateNotice();
    });

    container.querySelector('#confirmLockIn').addEventListener('click', async () => {
      const date = container.querySelector('#lockDate').value;
      const time = container.querySelector('#lockTime').value;
      const loc = container.querySelector('#lockLocation').value.trim() || 'UNKNOWN SECTOR';
      const share = `LOCKED IN: ${date} at ${time} in ${loc}. No fumbles.`;
      const message = container.querySelector('#shareMessage');
      const copyBtn = container.querySelector('#copyShare');
      message.textContent = share;
      message.classList.remove('hidden');
      copyBtn.classList.remove('hidden');
      state.scheduleISO = `${date}T${time}`;
      state.location = loc;
      state.manualLocation = loc;
      saveState(state);
      audio.confirm();
      updateNotice();

      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(share);
          showOverlay('Copied share message');
        } catch {
          showOverlay('Clipboard blocked');
        }
      };
    });
  }

  if (type === 'logout') {
    container.innerHTML = logoutModalTemplate();
    container.querySelector('#confirmLogout').addEventListener('click', () => {
      state.logoutAttempts += 1;
      saveState(state);
      audio.error();
      updateNotice();
      closeModal();
      showOverlay('Reschedule attempt logged');
    });
    container.querySelector('#cancelLogout').addEventListener('click', closeModal);
  }

  releaseFocus = trapFocus(container);
}

function closeModal() {
  const backdrop = document.querySelector('#modalBackdrop');
  backdrop.classList.add('hidden');
  backdrop.setAttribute('aria-hidden', 'true');
  releaseFocus();
}

function wireEvents() {
  const lockIn = document.querySelector('#lockIn');
  const logOut = document.querySelector('#logOut');
  const soundToggle = document.querySelector('#soundToggle');
  const motionToggle = document.querySelector('#motionToggle');
  const saveLocation = document.querySelector('#saveLocation');
  const showCharacters = document.querySelector('#showCharacters');
  const screen = document.querySelector('#screen');

  [lockIn, logOut, soundToggle, motionToggle, saveLocation, showCharacters].forEach((btn) => {
    btn.addEventListener('mouseenter', () => audio.hover());
    btn.addEventListener('click', () => buttonPulse(btn, state.motionEnabled));
  });

  lockIn.addEventListener('click', () => {
    audio.click();
    openModal('lock');
  });

  logOut.addEventListener('click', () => {
    audio.click();
    openModal('logout');
  });

  soundToggle.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    saveState(state);
    audio.click();
    updateNotice();
  });

  motionToggle.addEventListener('click', () => {
    state.motionEnabled = !state.motionEnabled;
    if (prefersReduced && state.motionEnabled) state.motionEnabled = false;
    saveState(state);
    applyMotionState(screen, state.motionEnabled);
    applyGlitchCycle();
    updateNotice();
  });

  saveLocation.addEventListener('click', () => {
    const manual = document.querySelector('#manualLocation').value.trim();
    if (!manual) return;
    state.manualLocation = manual;
    state.location = manual;
    saveState(state);
    updateNotice();
  });

  showCharacters.addEventListener('click', () => {
    state.showCharactersMobile = !state.showCharactersMobile;
    saveState(state);
    updateNotice();
  });

  document.querySelector('#modalBackdrop').addEventListener('click', (event) => {
    if (event.target.id === 'modalBackdrop') closeModal();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        state.location = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
        saveState(state);
        updateNotice();
      },
      () => {
        if (!state.manualLocation) state.location = 'UNKNOWN SECTOR';
        saveState(state);
        updateNotice();
      },
      { timeout: 5000 },
    );
  }
}

function init() {
  app.innerHTML = layoutTemplate(prefersReduced);
  applyMotionState(document.querySelector('#screen'), state.motionEnabled);
  wireEvents();
  updateNotice();
  scheduleClock();
  applyGlitchCycle();
}

window.addEventListener('beforeunload', () => {
  clearInterval(clockInterval);
  clearInterval(glitchInterval);
});

init();
