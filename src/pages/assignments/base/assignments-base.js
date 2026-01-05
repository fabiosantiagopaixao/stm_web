import { TerritoryAddressService } from "../../../api/services/TerritoryAddressService.js";
import { AssignmentsService } from "../../../api/services/AssignmentsService.js";
import { LoginService } from "../../../api/LoginService.js";

import { showLoading, hideLoading } from "../../../components/loading.js";
import { renderTerritoryCard } from "../../../components/territory-card.js";
import { showAssignTerritoryModal } from "../../../components/assign-territory-modal.js";
import { showConfirmModal } from "../../../components/modal.js";
import { renderAlertModal } from "../../../components/renderAlertModal.js";

/* ===== STATE ===== */
let territories = [];
let filteredTerritories = [];
const selectedTerritoryIds = new Set();
let currentPageType = null;

/* ===== LOAD ===== */
export async function loadAssignmentsBase({ pageType }) {
  currentPageType = pageType;

  const content = document.getElementById("card-data");
  const title = document.getElementById("pageTitle");

  title.textContent =
    pageType === "ASSIGNMENTS" ? "Assignments" : "My Assignments";

  showLoading(
    content,
    pageType === "ASSIGNMENTS"
      ? "Loading Assignments..."
      : "Loading My Assignments..."
  );

  const loginService = new LoginService();
  const user = loginService.getLoggedUser();

  const service = new TerritoryAddressService(user.country);
  territories =
    pageType === "ASSIGNMENTS"
      ? await service.listAllTerritories()
      : await service.listMyTerritories();

  filteredTerritories = territories;

  hideLoading(content);
  render();
}

/* ===== RENDER ===== */
function render() {
  const container = document.getElementById("card-data");
  container.innerHTML = "";

  if (filteredTerritories.length === 0) {
    container.innerHTML = `<p class="no_data">Ninguna asignación</p>`;
    return;
  }

  filteredTerritories.forEach((territory) => {
    const card = renderTerritoryCard(container, territory, {
      selectable: true,
      selected: selectedTerritoryIds.has(territory.id),
      showCheckbox: currentPageType === "MY_ASSIGNMENTS" ? false : true,

      onSelect: (checked) => {
        checked
          ? selectedTerritoryIds.add(territory.id)
          : selectedTerritoryIds.delete(territory.id);

        renderBottomBar();
      },

      onReturn: () => onReturnTerritory(territory),

      onViewAddress: (address) => onViewAddress(address),
    });

    container.appendChild(card);
  });

  renderBottomBar();
}

/* ===== BOTTOM BAR ===== */
function renderBottomBar() {
  let bar = document.getElementById("bottom-bar");

  if (selectedTerritoryIds.size === 0) {
    bar?.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement("div");
    bar.id = "bottom-bar";
    bar.className = "bottom-bar";
    document.body.appendChild(bar);
  }

  bar.innerHTML = `
    <strong>${selectedTerritoryIds.size}</strong> territories selected
    <button class="btn btn-primary btn-sm ms-2">Assign</button>
  `;

  bar.querySelector("button").onclick = openAssignModal;
}

/* ===== ASSIGN ===== */
function openAssignModal() {
  const selectedTerritories = territories.filter((t) =>
    selectedTerritoryIds.has(t.id)
  );

  showAssignTerritoryModal({
    selectedTerritories,

    onAssign: async (userId) => {
      const service = new AssignmentsService();

      await service.assignTerritories(
        selectedTerritories.map((t) => t.id),
        userId
      );

      resetState();
      await loadAssignmentsBase({ pageType: currentPageType });
    },

    onClose: () => {
      selectedTerritoryIds.clear();
      renderBottomBar();
    },
  });
}

/* ===== RETURN ===== */
function onReturnTerritory(territory) {
  const modal = showConfirmModal({
    title: "Retornar Territorio",
    message: `¿Está seguro que desea retornar el territorio <b>${territory.number}</b>?`,
    primaryLabel: "Sí",
    secondaryLabel: "No",
    onPrimary: () => returnTerritoryConfirm(territory),
  });

  modal.show();
}

async function returnTerritoryConfirm(territory) {
  const content = document.getElementById("card-data");

  showLoading(content, "Retornando territorio...");

  const service = new AssignmentsService();

  // ✅ USE O ID CORRETO
  await service.returnTerritory(territory.assigment);

  hideLoading(content);

  renderAlertModal(document.body, {
    type: "INFO",
    title: "Retornar Territorio",
    message: "Territorio retornado com sucesso!",
  });

  resetState();

  // 🔄 RELOAD REAL
  await loadAssignmentsBase({ pageType: currentPageType });
}

/* ===== STATE RESET ===== */
function resetState() {
  territories = [];
  filteredTerritories = [];
  selectedTerritoryIds.clear();
}
