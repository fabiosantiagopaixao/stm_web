import { showLoading, hideLoading } from "./loading.js";

/**
 * Assign Territory Modal
 *
 * Params:
 *  - users: [{ name }]
 *  - selectedTerritories: [{ id, number }]
 *  - onAssign: function(selectedUserName)
 *  - onClose: function()
 */
export function showAssignTerritoryModal({
  users = [],
  selectedTerritories = [],
  onAssign,
  onClose,
}) {
  // ===== Overlay =====
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  // ===== Modal =====
  const modal = document.createElement("div");
  modal.className = "modal-card";

  modal.innerHTML = `
    <div class="modal-header">
      <h5>Assign Territories</h5>
      <button class="btn-close">&times;</button>
    </div>

    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label fw-bold">Select Publisher</label>
        <select class="form-select" id="assignUserSelect">
          <option value="">-- Select --</option>
          ${users
            .map((u) => `<option value="${u.name}">${u.name}</option>`)
            .join("")}
        </select>
      </div>

      <div class="mb-2 fw-bold">Territories selected:</div>
      <ul class="list-group mb-3">
        ${selectedTerritories
          .map(
            (t) =>
              `<li class="list-group-item">
                Territory ${t.number}
              </li>`
          )
          .join("")}
      </ul>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" id="btnCancel">
        Cancel
      </button>
      <button class="btn btn-primary" id="btnAssign">
        Assign
      </button>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // ===== Elements =====
  const btnClose = modal.querySelector(".btn-close");
  const btnCancel = modal.querySelector("#btnCancel");
  const btnAssign = modal.querySelector("#btnAssign");
  const userSelect = modal.querySelector("#assignUserSelect");

  // ===== Close =====
  function close() {
    document.body.removeChild(overlay);
    onClose && onClose();
  }

  btnClose.onclick = close;
  btnCancel.onclick = close;

  // Fecha clicando fora
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // ===== Assign =====
  btnAssign.onclick = async () => {
    const selectedUserName = userSelect.value;

    if (!selectedUserName) {
      alert("Please select a publisher");
      return;
    }

    if (!selectedTerritories.length) {
      alert("No territories selected");
      return;
    }

    showLoading(modal, "Assigning territories...");

    try {
      await onAssign(selectedUserName);
      close();
    } catch (e) {
      console.error(e);
      alert("Failed to assign territories");
    } finally {
      hideLoading(modal);
    }
  };
}
