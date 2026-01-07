import { TerritoryAddressService } from "../../api/services/TerritoryAddressService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { loadTerritory } from "./index.js";
import { LoginService } from "../../api/LoginService.js";
import { renderAlertModal } from "../../components/renderAlertModal.js";
import { territoryTypeToLabel } from "./shared-territory.js";
import { removeAddButton } from "../util/PagesUtil.js";
import { renderSearchableCheckbox } from "../../components/searchBox.js";
import { translate } from "../../util/TranslateUtil.js";

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

  // Título da página
  document.getElementById("pageTitle").innerText = newTerritory
    ? translate("NEW_TERRITORY")
    : readonlyMode
    ? `${translate("VIEW_TERRITORY")} - ${territoryData.name}`
    : `${translate("EDIT_TERRITORY")} - ${territoryData.name}`;

  container.innerHTML = `
    <div class="card-body">
      <form id="territoryForm" novalidate>

        <!-- Número / Nome -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">${translate("NUMBER")}</label>
            <input type="text" class="form-control" id="number" value="${
              territoryData.number ?? ""
            }" disabled>
          </div>
          <div class="col-md-6">
            <label class="form-label">${translate("NAME")}</label>
            <input type="text" class="form-control" id="name" value="${
              territoryData.name ?? ""
            }" ${readonlyMode ? "disabled" : ""}>
            <div class="invalid-feedback">${translate("REQUIRED_NAME")}</div>
          </div>
        </div>

        <!-- Tipo -->
        <div class="row mb-3">
          <div class="col-md-6">
            <label class="form-label">${translate("TYPE")}</label>
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
              <div class="invalid-feedback d-none" id="typeError">${translate(
                "REQUIRED_TYPE"
              )}</div>
            </div>
          </div>
        </div>

        <!-- Endereços -->
        <div class="row mb-3">
          <div class="col-md-12">
            <label class="form-label">${translate("ADDRESSES")}</label>
            <div class="invalid-feedback-custom d-none" id="addressesError">${translate(
              "REQUIRED_ADDRESSES"
            )}</div>
            <div id="addressesContainer"></div>
          </div>
        </div>

        <!-- Ações -->
        <div class="row mt-4">
          <div class="col-md-12 d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" id="btnBack">
              <i class="fas fa-arrow-left"></i> ${translate("BACK")}
            </button>
            ${
              !readonlyMode
                ? `<button type="submit" class="btn btn-primary">
                     <i class="fas fa-save"></i> ${
                       newTerritory ? translate("SAVE") : translate("UPDATE")
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

  showLoading(containerAddress, translate("LOADING_ADDRESSES"));
  let addressesList =
    await territoryAddressService.getAllAddressesByTerritoryNumberToEditAndAdd(
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
    onChangeSelected: (ids) => (selectedAddressesIds = ids),
    onChangeDeselected: (ids) => (deselectedAddressesIds = ids),
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
        newTerritory
          ? translate("SAVING_TERRITORY")
          : translate("UPDATING_TERRITORY")
      );
      await territoryAddressService.saveUpdateAllData(
        updatedTerritory,
        selectedAddressesIds,
        deselectedAddressesIds
      );

      renderAlertModal(document.body, {
        type: "INFO",
        title: newTerritory
          ? translate("SAVE_TERRITORY")
          : translate("UPDATE_TERRITORY"),
        message: newTerritory
          ? translate("TERRITORY_SAVED_SUCCESS")
          : translate("TERRITORY_UPDATED_SUCCESS"),
      });

      loadTerritory();
    } catch (error) {
      console.error(error);
      hideLoading();
      renderAlertModal(document.body, {
        type: "ERROR",
        title: newTerritory
          ? translate("SAVE_TERRITORY")
          : translate("UPDATE_TERRITORY"),
        message: newTerritory
          ? translate("ERROR_SAVE_TERRITORY")
          : translate("ERROR_UPDATE_TERRITORY"),
      });
    } finally {
      hideLoading();
    }
  });

  container
    .querySelector("#btnBack")
    .addEventListener("click", () => loadTerritory());
}
