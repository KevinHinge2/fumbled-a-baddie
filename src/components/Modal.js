export function modalShellTemplate() {
  return `
    <div id="modalBackdrop" class="modal-backdrop hidden" aria-hidden="true">
      <div id="modalContainer" class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle"></div>
    </div>
  `;
}

export function lockInModalTemplate(defaultLocation, nextDate, nextTime) {
  return `
    <h3 id="modalTitle">LOCK IN SEQUENCE</h3>
    <label>Date <input id="lockDate" type="date" value="${nextDate}" aria-label="Pick date" /></label>
    <label>Time <input id="lockTime" type="time" value="${nextTime}" aria-label="Pick time" /></label>
    <label>Location <input id="lockLocation" type="text" value="${defaultLocation}" aria-label="Pick location" /></label>
    <div class="modal-actions">
      <button id="confirmLockIn" class="arcade-btn" aria-label="Confirm lock in">CONFIRM</button>
      <button id="cancelLockIn" class="arcade-btn danger" aria-label="Cancel lock in">CANCEL</button>
    </div>
    <p id="shareMessage" class="share-message hidden"></p>
    <button id="copyShare" class="tiny hidden" aria-label="Copy share message">COPY MESSAGE</button>
  `;
}

export function logoutModalTemplate() {
  return `
    <h3 id="modalTitle">LOG OUT?</h3>
    <p>Are you sure you want to fumble this timeline?</p>
    <div class="modal-actions">
      <button id="confirmLogout" class="arcade-btn danger" aria-label="Confirm log out">YES, LOG OUT</button>
      <button id="cancelLogout" class="arcade-btn" aria-label="Cancel log out">NOPE</button>
    </div>
  `;
}
