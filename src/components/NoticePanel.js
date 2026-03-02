export function noticePanelTemplate() {
  return `
    <section class="system-panel" aria-live="polite">
      <h2>SYSTEM NOTICE</h2>
      <p>DATE TIMER: <span id="dateTimer">--:--:--</span></p>
      <p>LOCATION: <span id="location">UNKNOWN SECTOR</span></p>
      <p>TIME: <span id="timeWithZone">--:-- --</span></p>
      <p>ATTEMPTS TO RESCHEDULE: <span id="attempts">0</span></p>
      <div class="panel-row">
        <label for="manualLocation" class="panel-label">Set location</label>
        <input id="manualLocation" class="panel-input" type="text" maxlength="40" placeholder="Neon City" aria-label="Set location manually" />
        <button id="saveLocation" class="tiny" aria-label="Save manual location">SAVE</button>
      </div>
    </section>
  `;
}
