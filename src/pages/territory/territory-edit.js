import { TerritoryService } from "../../api/services/TerritoryService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { loadTerritory } from "./index.js";
import { LoginService } from "../../api/LoginService.js";
import { renderAlertModal } from "../../components/renderAlertModal.js";
import { territoryTypeToLabel } from "./shared-territory.js";
import { removeAddButton } from "../util/PagesUtil.js";
import { renderSearchableCheckbox } from "../../components/searchBox.js";

/* ================= Helpers ================= */
const TERRITORY_TYPES = ["HOUSE_TO_HOUSE", "PHONE"];

function setInvalid(input) {
  input.classList.add("is-invalid");
}

function clearInvalid(input) {
  input.classList.remove("is-invalid");
}

/* ================= Component ================= */
export function renderTerritoryEdit(
  container,
  territoryData,
  readonlyMode = false
) {
  const newTerritory = territoryData.id === null;

  document.getElementById("pageTitle").innerText = newTerritory
    ? "Nuevo territorio"
    : readonlyMode
    ? `Ver territorio - ${territoryData.name}`
    : `Editar territorio - ${territoryData.name}`;

  container.innerHTML = `
    <div class="card-body">
      <form id="territoryForm" novalidate>

        <!-- Name / Territory -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Número</label>
            <input type="text" class="form-control" id="number" placeholder="Insira el número T-0001"
                   value="${territoryData.number}" ${
    readonlyMode || newTerritory ? "disabled" : ""
  }>
            <div class="invalid-feedback">El número es obligatorio</div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" placeholder="Insira el nombre"
                   value="${territoryData.name}" ${
    readonlyMode ? "disabled" : ""
  }>
            <div class="invalid-feedback">El nombre es obligatorio</div>
          </div>
        </div>

        <!-- Type -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Tipo</label>
            <div class="mt-2" id="typeGroup">
              ${TERRITORY_TYPES.map(
                (type) => `
                <div class="form-check">
                  <input class="form-check-input"
                         type="radio"
                         name="type"
                         id="type_${type}"
                         value="${type}"
                         ${territoryData.type === type ? "checked" : ""}
                         ${readonlyMode ? "disabled" : ""}>
                  <label class="form-check-label" for="type_${type}">
                    ${territoryTypeToLabel(type)}
                  </label>
                </div>
              `
              ).join("")}
              <div class="invalid-feedback" id="typeError">
                El tipo de usuario es obligatorio
              </div>
            </div>
          </div>
        </div>

        <!-- Addresses searchable -->
        <div class="row mb-3">
          <div class="col-md-12">
            <label class="form-label">Dirreciones</label>
            <div id="addressesContainer"></div>
            <div class="invalid-feedback" id="addressesError">Selecione pelo menos um endereço</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="row mt-4">
          <div class="col-md-12 d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" id="btnBack">
              <i class="fas fa-arrow-left"></i> Voltar
            </button>
            ${
              !readonlyMode
                ? `<button type="submit" class="btn btn-primary">
                     <i class="fas fa-save"></i> ${
                       newTerritory ? "Salvar" : "Atualizar"
                     }
                   </button>`
                : ""
            }
          </div>
        </div>

      </form>
    </div>
  `;

  removeAddButton();

  /* ================= Addresses component ================= */
  let addressesList = territoryData.addressesList || [
    {
      id: 1,
      name: "John Doe",
      gender: "M",
      type: "HOUSE_TO_HOUSE",
      age_type: "ADULT",
      address: "123 Main St",
      selected: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      gender: "F",
      type: "HOUSE_TO_HOUSE",
      age_type: "ADULT",
      address: "456 Oak St",
      selected: true,
    },
    {
      id: 3,
      name: "Alice Johnson",
      gender: "F",
      type: "APARTMENT",
      age_type: "CHILD",
      address: "789 Pine St",
      selected: false,
    },
  ];

  // marca os endereços já selecionados
  if (territoryData.addresses) {
    addressesList.forEach((item) => {
      item.selected = territoryData.addresses.includes(item.id);
    });
  }

  renderSearchableCheckbox({
    containerId: "addressesContainer",
    items: addressesList,
    onChange: (updatedItems) => {
      addressesList = updatedItems;
    },
  });

  /* ================= Validation & Submit ================= */
  const form = container.querySelector("#territoryForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (readonlyMode) return;

    let hasError = false;

    const name = form.querySelector("#name");
    const number = form.querySelector("#number");
    const typeChecked = form.querySelector('input[name="type"]:checked');
    const typeError = form.querySelector("#typeError");
    const addressesError = form.querySelector("#addressesError");

    [name, number].forEach(clearInvalid);
    typeError.style.display = "none";
    addressesError.style.display = "none";

    if (!name.value.trim()) {
      setInvalid(name);
      hasError = true;
    }
    if (!typeChecked) {
      typeError.style.display = "block";
      hasError = true;
    }
    if (!addressesList.some((a) => a.selected)) {
      addressesError.style.display = "block";
      hasError = true;
    }
    if (hasError) return;

    try {
      const service = new TerritoryService();
      const loginService = new LoginService();

      const updatedTerritory = {
        id: territoryData.id ?? null,
        number: newTerritory ? generateNumber() : number.value,
        name: name.value.trim(),
        type: typeChecked.value,
        addresses: addressesList.filter((a) => a.selected).map((a) => a.id),
        congregation_number:
          loginService.getLoggedTerritory().congregation_number,
      };

      showLoading(container, "Saving territory...");
      await service.saveUpdate(updatedTerritory);

      renderAlertModal(document.body, {
        type: "INFO",
        title: "Info",
        message: "Territorio salvo com sucesso!",
      }).modal("show");
      loadTerritory();
    } catch (error) {
      console.error("Error saving territory:", error);
      renderAlertModal(document.body, {
        type: "ERROR",
        title: "Error",
        message: "Ocorreu um erro ao salvar território!",
      }).modal("show");
    } finally {
      hideLoading();
    }
  });

  container
    .querySelector("#btnBack")
    .addEventListener("click", () => loadTerritory());

  function generateNumber() {
    return territoryData.number ?? "T-0001"; // Lógica simples de geração
  }
}
