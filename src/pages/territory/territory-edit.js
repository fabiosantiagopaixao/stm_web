import { TerritoryAddressService } from "../../api/services/TerritoryAddressService.js";
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
export async function renderTerritoryEdit(
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

        <!-- Number / Name -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">Número</label>
            <input type="text" class="form-control" id="number" value="${
              territoryData.number ?? ""
            }" disabled>
          </div>
          <div class="col-md-6">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" value="${
              territoryData.name ?? ""
            }" ${readonlyMode ? "disabled" : ""}>
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
                    <input class="form-check-input" type="radio" name="type" value="${type}" ${
                  territoryData.type === type ? "checked" : ""
                } ${readonlyMode ? "disabled" : ""}>
                    <label class="form-check-label">${territoryTypeToLabel(
                      type
                    )}</label>
                  </div>
                `
              ).join("")}
              <div class="invalid-feedback d-none" id="typeError">El tipo es obligatorio</div>
            </div>
          </div>
        </div>

        <!-- Addresses -->
        <div class="row mb-3">
          <div class="col-md-12">
            <label class="form-label">Direcciones</label>
            <div class="invalid-feedback-custom d-none" id="addressesError">Seleccione al menos una dirección</div>
            <div id="addressesContainer"></div>
            
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

  /* ================= Addresses ================= */
  const territoryAddressService = new TerritoryAddressService();
  const containerId = "addressesContainer";
  const containerAddress = document.getElementById(containerId);

  showLoading(containerAddress, "Cargando direcciones");
  let addressesList =
    await territoryAddressService.getAddressesByTerritoryNumber(
      territoryData.number
    );
  hideLoading();

  // Inicializa listas de IDs
  let selectedAddressesIds = [];
  let deselectedAddressesIds = [];

  renderSearchableCheckbox({
    containerId,
    items: addressesList,
    readonlyMode,
    onChangeSelected: (ids) => {
      selectedAddressesIds = ids;
      console.log("IDs recém selecionados:", ids); // 🔹 log cada alteração
    },
    onChangeDeselected: (ids) => {
      deselectedAddressesIds = ids;
      console.log("IDs desmarcados:", ids); // 🔹 log cada alteração
    },
  });

  /* ================= Validation & Submit ================= */
  const form = container.querySelector("#territoryForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (readonlyMode) return;

    let hasError = false;
    const name = form.querySelector("#name");
    const typeChecked = form.querySelector('input[name="type"]:checked');
    const typeError = form.querySelector("#typeError");
    const addressesError = form.querySelector("#addressesError");

    clearInvalid(name);
    typeError.classList.add("d-none");
    addressesError.classList.add("d-none");

    if (!name.value.trim()) {
      setInvalid(name);
      hasError = true;
    }
    if (!typeChecked) {
      typeError.classList.remove("d-none");
      hasError = true;
    }
    if (!addressesList.some((a) => a.selected)) {
      addressesError.classList.remove("d-none");
      hasError = true;
    }

    if (hasError) return;

    try {
      const loginService = new LoginService();
      const numberTerritory =
        await territoryAddressService.getLastNumberPlus1();

      const updatedTerritory = {
        id: territoryData.id ?? null,
        number: newTerritory ? numberTerritory : territoryData.number,
        name: name.value.trim(),
        type: typeChecked.value,
        addresses: addressesList.filter((a) => a.selected).map((a) => a.id),
        congregation_number: loginService.getLoggedUser().congregation_number,
      };

      showLoading(
        container,
        newTerritory ? "Saving territory" : "Actualizando territorio"
      );
      await territoryAddressService.saveUpdateAllData(
        updatedTerritory,
        selectedAddressesIds,
        deselectedAddressesIds
      );

      renderAlertModal(document.body, {
        type: "INFO",
        title: newTerritory ? "Salvar Territorio" : "Actualizar territorio",
        message: newTerritory
          ? "Territorio salvo com sucesso!"
          : "Territorio actualizado com sucesso!",
      });

      loadTerritory();
    } catch (error) {
      console.error(error);
      hideLoading();
      renderAlertModal(document.body, {
        type: "ERROR",
        title: newTerritory ? "Salvar Territorio" : "Actualizar Territorio",
        message: newTerritory
          ? "Ocorreu um erro ao salvar territorio!"
          : "Ocorreu um erro ao actulizar territorio!",
      });
    } finally {
      hideLoading();
    }
  });

  container.querySelector("#btnBack").addEventListener("click", () => {
    loadTerritory();
  });
}
