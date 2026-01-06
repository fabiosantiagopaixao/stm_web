import { removeAddButton, resolveLatLngWithComma } from "../util/PagesUtil";
import { translate } from "../util/TranslateUtil";
import { AddressService } from "../../api/services/AddressService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderContacts } from "../../components/contacts.js";
import { loadAddress } from "./index.js";
import { LoginService } from "../../api/LoginService.js";
import { renderAlertModal } from "../../components/renderAlertModal.js"; // ✅ novo modal

/* =================== CONSTANTS =================== */
export const AGE_TYPES = [
  { value: "CHILD", label: translate("CHILD") },
  { value: "YOUNG", label: translate("YOUNG") },
  { value: "ADULT", label: translate("ADULT") },
  { value: "SENIOR", label: translate("SENIOR") },
];

export const TERRITORY_TYPES = [
  { value: "BIBLE_COURSE", label: translate("BIBLE_COURSE") },
  { value: "PHONE_VISIT", label: translate("PHONE_VISIT") },
  { value: "VISIT", label: translate("VISIT") },
];

export const STATUS_TYPES = [
  { value: "VALID", label: translate("VALID") },
  { value: "DRAFT", label: translate("DRAFT") },
  { value: "VALIDATE", label: translate("VALIDATE") },
  { value: "INVALID", label: translate("INVALID") },
];

/* ================= Helpers ================= */
function setInvalid(input) {
  input.classList.add("is-invalid");
}
function clearInvalid(input) {
  input.classList.remove("is-invalid");
}

/* ================= Navigation ================= */
function goBackToAddresses() {
  window.location.replace(
    (import.meta.env.BASE_URL || "/").replace(/([^:]\/)\/+/g, "$1") + "home"
  );
}

/* ================= Save ================= */
async function saveAddress(container, data) {
  try {
    showLoading(container, "Guardando dirección");
    const service = new AddressService();
    await service.saveUpdate(data);
    loadAddress();
  } catch (error) {
    console.error("Error saving address:", error);

    renderAlertModal(document.body, {
      type: "ERROR",
      title: "Error",
      message: "¡Se produjo un error al guardar la dirección!",
    });
  } finally {
    hideLoading();
  }
}

/* ================= Main Component ================= */
export function renderAddressEdit(
  container,
  addressData,
  readonlyMode = false
) {
  const newAddres = addressData.id === null;

  container.innerHTML = `
  <div class="card-body">
    <form id="addressForm">
     <div class="accordion" id="addressAccordion">

      <!-- Información Personal -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#personalInfo">
            Información Personal
          </button>
        </h2>
        <div id="personalInfo" class="accordion-collapse collapse show">
          <div class="accordion-body">

            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input type="text" id="name" class="form-control" placeholder="Insira su nombre" maxlength="40" value="${
                addressData.name || ""
              }" ${readonlyMode ? "disabled" : ""}>
              <div class="invalid-feedback">Nombre obligatorio</div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Género</label>
              <div class="d-flex gap-2 mt-2" id="genderGroup">
                <div class="gender-option" data-value="Male">
                  <img src="img/man.png" class="gender-img" alt="Masculino">
                  <div class="gender-label">Hombre</div>
                </div>
                <div class="gender-option" data-value="Female">
                  <img src="img/woman.png" class="gender-img" alt="Femenino">
                  <div class="gender-label ">Mujer</div>
                </div>
              </div>
              <div class="invalid-feedback" id="genderError" style="display:none;">Seleccione género</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Edad</label>
              <select id="age_type" class="form-select" ${
                readonlyMode ? "disabled" : ""
              }>
                ${AGE_TYPES.map(
                  (opt) =>
                    `<option value="${opt.value}" ${
                      addressData.age_type === opt.value ? "selected" : ""
                    }>${opt.label}</option>`
                ).join("")}
              </select>
            </div>

            <div class="form-check form-check-inline">
              <input type="checkbox" id="deaf" class="form-check-input" ${
                addressData.deaf ? "checked" : ""
              } ${readonlyMode ? "disabled" : ""}>
              <label class="form-check-label" for="deaf">Sordo?</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="checkbox" id="mute" class="form-check-input" ${
                addressData.mute ? "checked" : ""
              } ${readonlyMode ? "disabled" : ""}>
              <label class="form-check-label" for="mute">Mudo?</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="checkbox" id="blind" class="form-check-input" ${
                addressData.blind ? "checked" : ""
              } ${readonlyMode ? "disabled" : ""}>
              <label class="form-check-label" for="blind">Ciego?</label>
            </div>
            <div class="form-check form-check-inline">
              <input type="checkbox" id="sign" class="form-check-input" ${
                addressData.sign ? "checked" : ""
              } ${readonlyMode ? "disabled" : ""}>
              <label class="form-check-label" for="sign">Sabes señas?</label>
            </div>

          </div>
        </div>
      </div>

      <!-- Dirección -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#direccion">
            Dirección
          </button>
        </h2>
        <div id="direccion" class="accordion-collapse collapse">
          <div class="accordion-body">
            <div class="mb-3">
              <label class="form-label">Dirección</label>
              <textarea id="address" class="form-control" placeholder="Insira su dirección" ${
                readonlyMode ? "disabled" : ""
              }>${addressData.address || ""}</textarea>
              <div class="invalid-feedback">Dirección obligatoria</div>
            </div>
            <div class="mb-3">
              <label class="form-label">Descripción del hogar</label>
              <textarea id="home_description" class="form-control" placeholder="Insira las descripción de la casa" ${
                readonlyMode ? "disabled" : ""
              }>${addressData.home_description || ""}</textarea>
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Tipo</label>
              <select id="type" class="form-select" ${
                readonlyMode ? "disabled" : ""
              }>
                ${TERRITORY_TYPES.map(
                  (opt) =>
                    `<option value="${opt.value}" ${
                      addressData.type === opt.value ? "selected" : ""
                    }>${opt.label}</option>`
                ).join("")}
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Estado</label>
              <select id="status" class="form-select" ${
                readonlyMode ? "disabled" : ""
              }>
                ${STATUS_TYPES.map(
                  (opt) =>
                    `<option value="${opt.value}" ${
                      addressData.status === opt.value ? "selected" : ""
                    }>${opt.label}</option>`
                ).join("")}
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#ubicacion">
            Ubicación
          </button>
        </h2>
        <div id="ubicacion" class="accordion-collapse collapse">
          <div class="accordion-body d-flex gap-2">
            <button type="button" id="btnMap" class="btn btn-primary" title="Localización actual"><i class="fas fa-map-marker-alt"></i> </button>
            <input type="number" step="any" id="lat" placeholder="Latitud" class="form-control" value="${
              addressData.lat || ""
            }">
            <input type="number" step="any" id="lng" placeholder="Longitud" class="form-control" value="${
              addressData.lng || ""
            }">
          </div>
        </div>
      </div>

      <!-- Notas -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#notas">
            Notas
          </button>
        </h2>
        <div id="notas" class="accordion-collapse collapse">
          <div class="accordion-body">
            <textarea id="description" class="form-control" placeholder="Insira una nota"  ${
              readonlyMode ? "disabled" : ""
            }>${addressData.description || ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Descripción de la Familia -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#familyDescription">
            Descripción de la Familia
          </button>
        </h2>
        <div id="familyDescription" class="accordion-collapse collapse">
          <div class="accordion-body">
            <textarea id="family_description" class="form-control" placeholder="Insiria una descripción de la familia"  ${
              readonlyMode ? "disabled" : ""
            }>${addressData.family_description || ""}</textarea>
          </div>
        </div>
      </div>

      <!-- Contactos -->
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#contacts">
            Contactos
          </button>
        </h2>
        <div id="contacts" class="accordion-collapse collapse">
          <div class="accordion-body" id="contactsContainer"></div>
        </div>
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
              ? `
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> ${newAddres ? "Salvar" : "Actualizar"}
            </button>`
              : ""
          }
        </div>
      </div>
    </form>
  </div>
  `;

  removeAddButton();

  /* ================= Gender ================= */
  const genderGroup = container.querySelector("#genderGroup");
  let genderValue = addressData.gender || null;

  const updateGenderUI = () => {
    genderGroup?.querySelectorAll(".gender-option").forEach((el) => {
      el.classList.toggle("selected", el.dataset.value === genderValue);
    });
  };
  updateGenderUI();

  genderGroup?.querySelectorAll(".gender-option").forEach((el) => {
    el.onclick = () => {
      genderValue = el.dataset.value;
      updateGenderUI();
      container.querySelector("#genderError").style.display = "none";
    };
  });

  /* ================= Contacts ================= */
  let phoneString = addressData.phone || "";
  renderContacts(
    "contactsContainer",
    phoneString,
    readonlyMode,
    (str) => (phoneString = str)
  );

  /* ================= Map ================= */
  container.querySelector("#btnMap")?.addEventListener("click", () => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      container.querySelector("#lat").value = pos.coords.latitude;
      container.querySelector("#lng").value = pos.coords.longitude;
    });
  });

  /* ================= Submit ================= */
  container.querySelector("#addressForm").onsubmit = async (e) => {
    e.preventDefault();

    const name = container.querySelector("#name");
    const address = container.querySelector("#address");
    const home = container.querySelector("#home_description");
    let error = false;

    [name, address, home].forEach(clearInvalid);

    if (!name.value.trim()) {
      setInvalid(name);
      error = true;
    }
    if (!address.value.trim()) {
      setInvalid(address);
      error = true;
    }
    if (!home.value.trim()) {
      setInvalid(home);
      error = true;
    }
    if (!genderValue) {
      container.querySelector("#genderError").style.display = "block";
      error = true;
    }

    if (error) {
      renderAlertModal(document.body, {
        type: "ERROR",
        title: "Error",
        message: "¡Por favor, rellene los campos obligatorios!",
      });
      return;
    }

    const loginService = new LoginService();
    const userLogged = loginService.getLoggedUser();

    const addressNew = {
      id: addressData.id ?? null,
      congregation_number: userLogged.congregation_number,
      created_by: userLogged.user,
      name: name.value.trim(),
      address: address.value.trim(),
      gender: genderValue,
      lat: resolveLatLngWithComma(container, "#lat"),
      lng: resolveLatLngWithComma(container, "#lng"),
      home_description: home.value.trim(),
      phone: phoneString,

      age_type: container.querySelector("#age_type").value,
      deaf: container.querySelector("#deaf").checked,
      mute: container.querySelector("#mute").checked,
      blind: container.querySelector("#blind").checked,
      sign: container.querySelector("#sign").checked,

      description: container.querySelector("#description").value,

      type: container.querySelector("#type").value,
      status: container.querySelector("#status").value,

      family_description: container.querySelector("#family_description").value,
    };
    await saveAddress(container, addressNew);
  };

  /* ================= Back ================= */
  container.querySelector("#btnBack").addEventListener("click", () => {
    loadAddress();
  });
}
