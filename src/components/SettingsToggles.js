export function settingsTemplate() {
  return `
    <div class="toggles" role="group" aria-label="Sound and motion settings">
      <button id="soundToggle" class="tiny" aria-label="Toggle sound">SOUND: OFF</button>
      <button id="motionToggle" class="tiny" aria-label="Toggle motion">MOTION: ON</button>
      <button id="showCharacters" class="tiny mobile-only" aria-label="Toggle character stickers">SHOW CHARACTERS</button>
    </div>
  `;
}
