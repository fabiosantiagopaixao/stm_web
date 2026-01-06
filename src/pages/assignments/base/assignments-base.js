import { TerritoryAddressService } from "../../../api/services/TerritoryAddressService.js";
import { AssignmentsService } from "../../../api/services/AssignmentsService.js";
import { LoginService } from "../../../api/LoginService.js";
import { UserService } from "../../../api/services/UserService.js";

import { showLoading, hideLoading } from "../../../components/loading.js";
import { renderTerritoryCard } from "../../../components/territory-card.js";
import { showAssignTerritoryModal } from "../../../components/assign-territory-modal.js";
import { showConfirmModal } from "../../../components/modal.js";
import { renderAlertModal } from "../../../components/renderAlertModal.js";
import {
  setUpButtonAsign,
  setUpMapButton,
  getUserLocation,
} from "../../../pages/util/PagesUtil.js";

/* ===== STATE ===== */
let territories = [];
let filteredTerritories = [];
const selectedTerritoryIds = new Set();
let currentPageType = null;

let filterText = "";
let filterOpen = false;
let hideAssigned = false;
let distanceKm = null;

let userPosition = null;
let locationAsked = false;
let locationDenied = false;

/* ===== GEO ===== */
function toRad(v) {
  return (v * Math.PI) / 180;
}

function distanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function requestUserLocationOnce() {
  if (userPosition) return userPosition;
  if (locationDenied) return null;

  if (!locationAsked) {
    locationAsked = true;
    const allow = confirm(
      "We need your location to show nearby territories. Do you want to allow it?"
    );
    if (!allow) {
      locationDenied = true;
      return null;
    }
  }

  try {
    userPosition = await getUserLocation();
    if (!userPosition) {
      alert("Não foi possível determinar sua localização.");
      return;
    }
    console.log("Latitude:", userPosition.lat, "Longitude:", userPosition.lng);
    return userPosition;
  } catch {
    locationDenied = true;
    return null;
  }
}

/* ===== LOAD ===== */
export async function loadAssignmentsBase({ pageType }) {
  currentPageType = pageType;

  const container = document.getElementById("card-data");
  container.classList.add("card-data-territory");

  document.getElementById("pageTitle").innerText =
    pageType === "ASSIGNMENTS" ? "Assignments" : "My Assignments";

  showLoading(container, "Loading Assignments");

  const loginService = new LoginService();
  const user = loginService.getLoggedUser();

  const service = new TerritoryAddressService(user.country);
  territories =
    pageType === "ASSIGNMENTS"
      ? await service.listAllTerritories()
      : await service.listMyTerritories();

  filteredTerritories = territories;

  hideLoading(container);
  render();
}

/* ===== FILTER ===== */
async function applyFilter() {
  const text = filterText.toLowerCase();

  let position = null;
  if (distanceKm) {
    position = await requestUserLocationOnce();
  }

  filteredTerritories = territories.filter((t) => {
    // Filtrar por texto (nome, número ou endereço)
    const byText =
      t.name?.toLowerCase().includes(text) ||
      String(t.number).includes(text) ||
      t.addresses?.some((a) => a.name?.toLowerCase().includes(text));

    // Filtrar por atribuição
    const byAssigned = hideAssigned ? !t.isAssigned : true;

    // Filtrar por distância
    let byDistance = true;
    if (distanceKm) {
      if (!position) return false;

      byDistance =
        t.addresses?.some((address) => {
          if (!address.lat || !address.lng) return false;

          return (
            distanceInKm(
              position.lat,
              position.lng,
              Number(address.lat),
              Number(address.lng)
            ) <= distanceKm
          );
        }) || false;
    }

    return byText && byAssigned && byDistance;
  });

  renderList();
  setUpMapButton(filteredTerritories); // atualiza botão do mapa
}

/* ===== RENDER ===== */
function render() {
  setUpMapButton(filteredTerritories);
  const container = document.getElementById("card-data");
  renderCardFilter(container);
  renderList();
}

function renderCardFilter(container) {
  container.innerHTML = "";

  let html = "";

  if (currentPageType === "ASSIGNMENTS") {
    html += `
      <div class="card card-filter mb-2">
        <div class="card-header filter-header d-flex justify-content-between align-items-center" style="cursor:pointer">
          <span class="fw-bold">Filtro</span>
          <i class="fas ${
            filterOpen ? "fa-chevron-up" : "fa-chevron-down"
          } filter-toggle"></i>
        </div>

        <div class="card-body p-2 filter-body ${filterOpen ? "" : "d-none"}">
          <input
            type="text"
            id="territory-filter"
            class="form-control mb-2"
            placeholder="Search territory..."
          />

          <input
            type="number"
            id="distance-filter"
            class="form-control mb-2"
            min="1"
            max="10"
            placeholder="Mostrar direcciones cerca (KM)"
          />

          <div class="form-check" style="margin-left:3px;">
            <input
              class="form-check-input"
              type="checkbox"
              id="hide-assigned"
            />
            <label class="form-check-label" for="hide-assigned">
              Ocultar territorios asignados
            </label>
          </div>
        </div>
      </div>
    `;
  }

  html += `<div id="territory-list"></div>`;
  container.innerHTML = html;

  if (currentPageType === "ASSIGNMENTS") {
    bindFilterEvents();
  }
}

/* ===== EVENTS ===== */
function bindFilterEvents() {
  document.getElementById("territory-filter").oninput = (e) => {
    filterText = e.target.value;
    applyFilter();
  };

  document.getElementById("hide-assigned").onchange = (e) => {
    hideAssigned = e.target.checked;
    applyFilter();
  };

  document.getElementById("distance-filter").oninput = (e) => {
    const v = Number(e.target.value);
    distanceKm = v > 0 ? Math.min(v, 10) : null;
    applyFilter();
  };

  const header = document.querySelector(".filter-header");
  const body = document.querySelector(".filter-body");
  const icon = document.querySelector(".filter-toggle");

  header.onclick = () => {
    filterOpen = !filterOpen;
    body.classList.toggle("d-none", !filterOpen);
    icon.className = `fas ${
      filterOpen ? "fa-chevron-up" : "fa-chevron-down"
    } filter-toggle`;
  };
}

/* ===== LIST ===== */
function renderList() {
  const list = document.getElementById("territory-list");
  list.innerHTML = "";

  if (!filteredTerritories.length) {
    list.innerHTML = `<p class="no_data">Ninguna asignación</p>`;
    return;
  }

  filteredTerritories.forEach((territory) => {
    list.appendChild(
      renderTerritoryCard(list, territory, {
        selectable: true,
        selected: selectedTerritoryIds.has(territory.id),
        isAssigned:
          currentPageType === "MY_ASSIGNMENTS" ? true : territory.isAssigned,
        pageType: currentPageType,

        onSelect: (checked) => {
          checked
            ? selectedTerritoryIds.add(territory.id)
            : selectedTerritoryIds.delete(territory.id);
          showAssign();
        },

        onReturn: () => onReturnTerritory(territory),
      })
    );
  });
}

/* ===== ASSIGN ===== */
function showAssign() {
  const qty = selectedTerritoryIds.size;
  if (!qty) return;

  setUpButtonAsign({
    content: document.getElementById("card-data"),
    label: qty === 1 ? "Assign 1 Territory" : `Assign ${qty} Territories`,
    onClick: openAssignModal,
  });
}

/* ===== MODAL ===== */
async function openAssignModal() {
  const selectedTerritories = territories.filter((t) =>
    selectedTerritoryIds.has(t.id)
  );

  const userService = new UserService();
  const users = await userService.getByCongregation();

  showAssignTerritoryModal({
    users,
    selectedTerritories,
    onAssign: async ({ user, territories }) => {
      const content = document.getElementById("card-data");
      showLoading(content, "Assigning territories...");

      try {
        const service = new AssignmentsService();
        await service.assignTerritories(user, territories);

        renderAlertModal(content, {
          type: "SUCCESS",
          title: "Assigned",
          message: "Territories assigned successfully",
        });

        await loadAssignmentsBase({ pageType: currentPageType });
      } finally {
        hideLoading(content);
      }
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
  await service.returnTerritory(territory.assignment);

  hideLoading(content);

  renderAlertModal(document.body, {
    type: "INFO",
    title: "Retornar Territorio",
    message: "Territorio retornado com sucesso!",
  });

  resetState();
  await loadAssignmentsBase({ pageType: currentPageType });
}

/* ===== RESET ===== */
function resetState() {
  territories = [];
  filteredTerritories = [];
  selectedTerritoryIds.clear();
}
