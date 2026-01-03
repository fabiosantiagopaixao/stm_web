import { translate } from "../pages/util/TranslateUtil";

/* ================= Contacts Component (FINAL + Validation Feedback) ================= */
export function renderContacts(
  containerId,
  phoneString = "",
  readonly = false,
  onChange = null
) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // ===== Estado interno =====
  let contacts = [];

  // Inicializa a partir da string
  if (phoneString) {
    phoneString.split("-").forEach((entry) => {
      const [name, phone] = entry.split("|");
      if (name && phone) contacts.push({ name, phone });
    });
  }

  // ===== Helpers =====
  const buildPhoneString = () =>
    contacts.map((c) => `${c.name}|${c.phone}`).join("-");

  const emitChange = () => {
    if (onChange) onChange(buildPhoneString());
  };

  const setInvalid = (input) => input.classList.add("is-invalid");
  const clearInvalid = (input) => input.classList.remove("is-invalid");

  // ===== Render =====
  const render = () => {
    container.innerHTML = `
      ${
        !readonly
          ? `
        <div class="mb-3">
          <div class="d-flex gap-2 align-items-center">
            <div class="flex-grow-1">
              <input type="text" id="contactName" class="form-control form-control-sm"
                placeholder="${translate("NAME")}">
              <div class="invalid-feedback">Nombre de contacto obligatorio</div>
            </div>

            <div class="flex-grow-1">
              <input type="text" id="contactPhone" class="form-control form-control-sm"
                placeholder="Teléfono">
              <div class="invalid-feedback">Número de teléfono de contacto obligatorio</div>
            </div>

            <button type="button" id="btnAddContact" class="btn btn-sm btn-success">+</button>
          </div>
        </div>
      `
          : ""
      }

      <div id="contactsTableWrapper" style="display:none;" class="${
        readonly ? "readOnlyData" : "table-custom"
      }">
        <table class="table table-sm table-bordered">
          <thead>
            <tr>
              <th>${translate("NAME")}</th>
              <th>Teléfono</th>
              ${!readonly ? "<th></th>" : ""}
            </tr>
          </thead>
          <tbody id="contactsTableBody"></tbody>
        </table>
      </div>
    `;

    renderTable();
    bindEvents();
  };

  const renderTable = () => {
    const wrapper = container.querySelector("#contactsTableWrapper");
    const tbody = container.querySelector("#contactsTableBody");

    if (!wrapper || !tbody) return;

    // mostra tabela apenas se houver dados
    if (contacts.length === 0) {
      wrapper.style.display = "none";
      return;
    }

    wrapper.style.display = "block";
    tbody.innerHTML = "";

    contacts.forEach((c, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.phone}</td>
        ${
          !readonly
            ? `<td class="text-center">
                 <button type="button" class="btn btn-sm btn-danger" data-index="${index}">×</button>
               </td>`
            : ""
        }
      `;
      tbody.appendChild(tr);
    });

    // remover contato
    if (!readonly) {
      tbody.querySelectorAll("button").forEach((btn) => {
        btn.onclick = () => {
          const index = Number(btn.dataset.index);
          contacts.splice(index, 1);
          renderTable();
          emitChange();
        };
      });
    }
  };

  const bindEvents = () => {
    if (readonly) return;

    const btnAdd = container.querySelector("#btnAddContact");
    const nameInput = container.querySelector("#contactName");
    const phoneInput = container.querySelector("#contactPhone");

    btnAdd.onclick = () => {
      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();

      // ===== validação =====
      clearInvalid(nameInput);
      clearInvalid(phoneInput);

      let hasError = false;
      if (!name) {
        setInvalid(nameInput);
        hasError = true;
      }
      if (!phone) {
        setInvalid(phoneInput);
        hasError = true;
      }
      if (hasError) return;

      // adiciona à lista
      contacts.push({ name, phone });

      // limpa campos
      nameInput.value = "";
      phoneInput.value = "";

      renderTable();
      emitChange();
    };
  };

  render();
}
