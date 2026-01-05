import { TerritoryAddressService } from "../../../api/services/TerritoryAddressService.js";
import { AssignmentsService } from "../../../api/services/AssignmentsService.js";
import { LoginService } from "../../../api/LoginService.js";

import { showLoading, hideLoading } from "../../../components/loading.js";
import { renderTerritoryCard } from "../../../components/territory-card.js";
import { showAssignTerritoryModal } from "../../../components/assign-territory-modal.js";

// ===== Estado =====
let territories = [];
let filteredTerritories = [];
const selectedTerritoryIds = new Set();

// ===== Load =====
export async function loadAssignmentsBase({ pageType }) {
  const allowAssign = pageType === "ASSIGNMENTS";
  const container = document.getElementById("card-data");
  const title = document.getElementById("pageTitle");

  title.textContent =
    pageType === "ASSIGNMENTS" ? "Assignments" : "My Assignments";

  const msgLaoding =
    pageType === "ASSIGNMENTS"
      ? "Loading Assignments"
      : "Loading My Assignments";
  showLoading(container, msgLaoding);

  const loginService = new LoginService();
  const user = loginService.getLoggedUser();

  const service = new TerritoryAddressService(user.country);
  territories =
    pageType === "ASSIGNMENTS"
      ? await service.listAllTerritories()
      : await service.listMyTerritories();

  filteredTerritories = territories;

  hideLoading(container);
  render(pageType);
}

// ===== Render =====
function render(pageType) {
  const container = document.getElementById("card-data");
  container.innerHTML = "";

  if (filteredTerritories.length === 0) {
    container.innerHTML = "<p class='no_data'>Ninguna asignación</p>";
    return;
  }

  filteredTerritories.forEach((territory) => {
    const card = renderTerritoryCard(container, territory, {
      selectable: true,
      selected: selectedTerritoryIds.has(territory.id),
      showCheckbox: pageType === "MY_ASSIGNMENTS" ? false : true,

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

// ===== Bottom Bar =====
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

// ===== Assign =====
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

      selectedTerritoryIds.clear();
      await loadAssignmentsBase();
    },

    onClose: () => {
      selectedTerritoryIds.clear();
      renderBottomBar();
    },
  });
}

// ===== Actions =====
function onReturnTerritory(territory) {
  if (!confirm(`Return territory ${territory.number}?`)) return;

  const service = new AssignmentsService();
  service.returnTerritory(territory.id).then(loadAssignments);
}

function onViewAddress(address) {
  console.log("View address", address);
}
