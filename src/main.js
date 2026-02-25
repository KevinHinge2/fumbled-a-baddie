import './styles.css';
import { createAudio } from './audio';
import { clearState, loadState, saveState } from './state';
import { startParallax, trapFocus, triggerGlitch, triggerScreenShake } from './effects';

const state = loadState();
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="crt-power" aria-hidden="true"></div>
  <main class="screen ${prefersReduced ? 'reduced-motion' : ''}" id="screen">
    <div class="fx scanlines"></div>
    <div class="fx grain"></div>
    <div class="fx vignette"></div>

    <header>
      <h1>GAME OVER</h1>
      <p>oh no.<br />you're about to fumble a baddie</p>
    </header>

    <section class="system-panel" aria-live="polite">
      <h2>SYSTEM NOTICE:</h2>
      <p>DATE TIMER: <span id="dateTimer">23:59:59</span></p>
      <p>LOCATION: <span id="location">missing</span></p>
      <p>TIME: <span id="time">missing</span></p>
      <p>ATTEMPTS TO RESCHEDULE: <span id="attempts">not found</span></p>
    </section>

    <section class="controls">
      <button id="lockIn" class="arcade-btn" aria-label="Lock in date and time">LOCK IN</button>
      <button id="logOut" class="arcade-btn danger" aria-label="Log out">LOG OUT</button>
    </section>

    <div class="toggles">
      <button id="soundToggle" class="tiny">SOUND: ON</button>
      <button id="motionToggle" class="tiny">MOTION: ON</button>
      <button id="plusFive" class="tiny hidden">+5 MIN</button>
    </div>

    <img class="character kevin" id="kevin" src="/characters/kevin_character.png" alt="Kevin" />
    <img class="character brianna" id="brianna" src="/characters/brianna_character.png" alt="Brianna" />

    <div id="overlay" class="overlay hidden" role="alert"></div>

    <div id="modalBackdrop" class="modal-backdrop hidden">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Schedule date modal">
        <h3>LOCK IN DETAILS</h3>
        <label>Location<input id="locationInput" type="text" placeholder="Arcade Palace" /></label>
        <label>Date<input id="dateInput" type="date" /></label>
        <label>Time<input id="timeInput" type="time" /></label>
        <div class="modal-actions">
          <button id="saveSchedule" class="arcade-btn">SAVE</button>
          <button id="cancelSchedule" class="arcade-btn danger">CANCEL</button>
        </div>
      </div>
    </div>
  </main>
`;

const refs = {
  screen: document.querySelector('#screen'),
  dateTimer: document.querySelector('#dateTimer'),
  location: document.querySelector('#location'),
  time: document.querySelector('#time'),
  attempts: document.querySelector('#attempts'),
  overlay: document.querySelector('#overlay'),
  lockIn: document.querySelector('#lockIn'),
  logOut: document.querySelector('#logOut'),
  kevin: document.querySelector('#kevin'),
  brianna: document.querySelector('#brianna'),
  modalBackdrop: document.querySelector('#modalBackdrop'),
  locationInput: document.querySelector('#locationInput'),
  dateInput: document.querySelector('#dateInput'),
  timeInput: document.querySelector('#timeInput'),
  saveSchedule: document.querySelector('#saveSchedule'),
  cancelSchedule: document.querySelector('#cancelSchedule'),
  soundToggle: document.querySelector('#soundToggle'),
  motionToggle: document.querySelector('#motionToggle'),
  plusFive: document.querySelector('#plusFive'),
};

const audio = createAudio(() => state);
let focusRelease = () => {};

function formatRemaining(ms) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function renderStatic() {
  refs.location.textContent = state.location;
  refs.time.textContent = state.targetTimestamp
    ? new Date(state.targetTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'missing';
  refs.attempts.textContent = state.logoutAttempts ? String(state.logoutAttempts) : 'not found';
  refs.soundToggle.textContent = `SOUND: ${state.soundEnabled ? 'ON' : 'OFF'}`;
  refs.motionToggle.textContent = `MOTION: ${state.motionEnabled ? 'ON' : 'OFF'}`;
  refs.plusFive.classList.toggle('hidden', !state.secondChanceUnlocked || state.secondChanceUsed);
}

function showOverlay(text, sticky = false) {
  refs.overlay.textContent = text;
  refs.overlay.classList.remove('hidden');
  if (!sticky) setTimeout(() => refs.overlay.classList.add('hidden'), 1800);
}

function openModal() {
  refs.modalBackdrop.classList.remove('hidden');
  focusRelease = trapFocus(refs.modalBackdrop);
}

function closeModal() {
  refs.modalBackdrop.classList.add('hidden');
  focusRelease();
}

function checkEndings(remaining) {
  if (remaining <= 0 && state.targetTimestamp && state.ending !== 'game-over') {
    state.ending = 'game-over';
    saveState(state);
    refs.screen.classList.add('darkened', 'game-over-state');
    refs.kevin.classList.add('freeze');
    refs.brianna.classList.add('walk-off');
    audio.gameOver();
    showOverlay('GAME OVER\nSHE MOVED ON', true);
    const restart = document.createElement('button');
    restart.className = 'arcade-btn';
    restart.textContent = 'RESTART';
    restart.onclick = () => {
      clearState();
      window.location.reload();
    };
    refs.overlay.appendChild(document.createElement('br'));
    refs.overlay.appendChild(restart);
  }

  if (state.logoutAttempts >= 3 && state.ending !== 'system-locked') {
    state.ending = 'system-locked';
    refs.screen.classList.add('glitch-intense');
    showOverlay('SYSTEM LOCKED', false);
    saveState(state);
  }
}

function tick() {
  const remaining = state.targetTimestamp ? state.targetTimestamp - Date.now() : 86399000;
  refs.dateTimer.textContent = formatRemaining(remaining);
  if (remaining <= 60000 && remaining > 0) audio.warningTick();
  checkEndings(remaining);
}

let last = 0;
function rafLoop(ts) {
  if (ts - last > 1000) {
    tick();
    last = ts;
  }
  requestAnimationFrame(rafLoop);
}

const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const keys = [];
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  keys.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
  if (keys.length > konami.length) keys.shift();
  if (konami.every((key, idx) => key === keys[idx])) {
    state.secondChanceUnlocked = true;
    saveState(state);
    renderStatic();
    showOverlay('SECOND CHANCE MODE UNLOCKED');
  }
});

refs.lockIn.addEventListener('click', () => {
  audio.click();
  openModal();
});

refs.saveSchedule.addEventListener('click', () => {
  const loc = refs.locationInput.value.trim();
  const d = refs.dateInput.value;
  const t = refs.timeInput.value;
  if (!loc || !d || !t) return showOverlay('fill all fields');

  state.location = loc;
  state.targetTimestamp = new Date(`${d}T${t}`).getTime();
  state.ending = 'locked-in';
  saveState(state);

  refs.kevin.classList.add('relax');
  refs.brianna.classList.add('glow');
  audio.success();
  renderStatic();
  showOverlay('DATE CONFIRMED');
  closeModal();
});

refs.cancelSchedule.addEventListener('click', closeModal);
refs.modalBackdrop.addEventListener('click', (e) => {
  if (e.target === refs.modalBackdrop) closeModal();
});

refs.logOut.addEventListener('click', () => {
  state.logoutAttempts += 1;
  saveState(state);
  renderStatic();
  audio.error();
  triggerScreenShake(refs.screen);
  triggerGlitch(refs.screen, state.logoutAttempts >= 3);
  showOverlay('logout blocked\nreschedule not found');
});

refs.soundToggle.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  saveState(state);
  renderStatic();
  audio.click();
});

refs.motionToggle.addEventListener('click', () => {
  state.motionEnabled = !state.motionEnabled;
  saveState(state);
  renderStatic();
});

refs.plusFive.addEventListener('click', () => {
  if (state.secondChanceUsed || !state.targetTimestamp) return;
  state.targetTimestamp += 5 * 60 * 1000;
  state.secondChanceUsed = true;
  saveState(state);
  renderStatic();
  showOverlay('+5 MIN APPLIED');
  audio.success();
});

renderStatic();
requestAnimationFrame(rafLoop);
startParallax(refs.kevin, refs.brianna, () => state.motionEnabled);
