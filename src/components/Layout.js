import { buttonTemplate } from './Button';
import { noticePanelTemplate } from './NoticePanel';
import { settingsTemplate } from './SettingsToggles';
import { modalShellTemplate } from './Modal';
import kevinCharacter from '../assets/kevin_character.svg';
import briannaCharacter from '../assets/brianna_character.svg';

export function layoutTemplate(prefersReduced) {
  return `
    <main class="screen ${prefersReduced ? 'motion-off' : ''}" id="screen">
      <div class="fx scanlines" aria-hidden="true"></div>
      <div class="fx grain" aria-hidden="true"></div>
      <div class="fx vignette" aria-hidden="true"></div>

      <header class="hero">
        <h1>GAME OVER</h1>
        <p>oh no.<br/>you're about to fumble a baddie</p>
        <p class="hero-joke" id="heroJoke" aria-live="polite">Tip: bad timing is recoverable. bad communication is not.</p>
      </header>

      <section class="layout-grid">
        <aside class="character-col left" aria-hidden="true">
          <img class="character" id="kevin" src="${kevinCharacter}" width="260" height="360" loading="lazy" decoding="async" alt="" />
        </aside>

        <section class="center-ui">
          ${noticePanelTemplate()}
          <div class="controls">
            ${buttonTemplate({ id: 'lockIn', label: 'LOCK IN', ariaLabel: 'Lock in a date' })}
            ${buttonTemplate({ id: 'logOut', label: 'LOG OUT', ariaLabel: 'Open logout confirmation', variant: 'danger' })}
          </div>
          ${settingsTemplate()}
        </section>

        <aside class="character-col right" aria-hidden="true">
          <img class="character" id="brianna" src="${briannaCharacter}" width="260" height="360" loading="lazy" decoding="async" alt="" />
        </aside>
      </section>

      <div id="overlay" class="overlay hidden" role="status" aria-live="polite"></div>
      ${modalShellTemplate()}
    </main>
  `;
}
