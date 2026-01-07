import { renderAlertModal } from "../components/renderAlertModal.js";
import { translate } from "../util/TranslateUtil.js";

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
      <h5>${translate("ASSIGN_TERRITORIES")}</h5>
      <button class="btn-close">&times;</button>
    </div>

    <div class="modal-body">
      <div class="mb-3">
        <label class="form-label fw-bold">${translate(
          "SELECT_PUBLISHER"
        )}</label>
        <select class="form-select" id="assignUserSelect">
          <option value="">-- ${translate("SELECT")} --</option>
          ${users
            .map(
              (u) =>
                `<option value="${u.user}">${u.name} - (${u.user})</option>`
            )
            .join("")}
        </select>
      </div>

      <div class="mb-2 fw-bold">${translate("TERRITORIES_SELECTED")}:</div>
      <ul class="list-group mb-3">
        ${selectedTerritories
          .map(
            (t) =>
              `<li class="list-group-item">
                 ${t.number} - (${t.name})
              </li>`
          )
          .join("")}
      </ul>
    </div>

    <div class="modal-footer">
      <button class="btn btn-danger" id="btnCancel">
        ${translate("CANCEL")}
      </button>
      <button class="btn btn-primary" id="btnAssign">
        ${translate("ASSIGN")}
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

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // ===== Assign =====
  btnAssign.onclick = () => {
    const selectedUser = userSelect.value;

    if (!selectedUser) {
      renderAlertModal(document.body, {
        type: "ERROR",
        title: translate("ERROR"),
        message: translate("ERROR_NO_USER"),
      });
      return;
    }

    if (!selectedTerritories.length) {
      renderAlertModal(document.body, {
        type: "ERROR",
        title: translate("ERROR"),
        message: translate("ERROR_NO_TERRITORIES"),
      });
      return;
    }

    // ✅ Primeiro fecha o modal
    close();

    onAssign &&
      onAssign({
        user: selectedUser,
        territories: selectedTerritories,
      });
  };
}
