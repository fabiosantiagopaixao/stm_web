import { renderAddressList } from "./address-list.js";

export function renderTerritoryCard(
  container,
  territory,
  {
    selectable = false,
    selected = false,
    onSelect = null,
    onReturn = null,
    showCheckbox = true, // ✅ nova propriedade
  } = {}
) {
  const card = document.createElement("div");
  card.className = "card territory-card mb-2";

  let BASE_PATH = import.meta.env.BASE_URL || "/";
  if (BASE_PATH.endsWith("/")) BASE_PATH = BASE_PATH.slice(0, -1);

  const typeIcon =
    territory.type === "PHONE"
      ? `${BASE_PATH}/img/phone.png`
      : `${BASE_PATH}/img/house.png`; // default HOUSE_TO_HOUSE

  let expanded = false;

  card.innerHTML = `
    <div class="card-body d-flex territory-header">

      <!-- LEFT 65% -->
      <div class="territory-name d-flex align-items-center gap-2" style="width:65%">
        <img src="${typeIcon}" width="32" />
        <div>
          <div>${territory.name}</div>
        </div>
      </div>

      <!-- RIGHT 35% -->
      <div class="territory-info d-flex align-items-center text-end" style="width:35%">
        ${
          onReturn
            ? `<a href="#" class="return-territory me-2" title="Return territory">
                 <i class="fas fa-angle-double-left"></i>
               </a>`
            : ""
        }

        <div class="flex-grow-1">
          <div>${territory.number}</div>
          ${
            territory.nameAssigned
              ? `<div class="small text-primary">${territory.nameAssigned}</div>`
              : ""
          }
          <i class="fas fa-chevron-down toggle-icon mt-2 d-block"></i>
        </div>
      </div>
    </div>

    <!-- EXPAND -->
    <div class="territory-addresses d-none"></div>
  `;

  /* ===== Elements ===== */
  const toggleIcon = card.querySelector(".toggle-icon");
  const addressesContainer = card.querySelector(".territory-addresses");
  const returnBtn = card.querySelector(".return-territory");

  /* ===== Toggle expand ===== */
  card.querySelector(".territory-header").onclick = () => {
    expanded = !expanded;

    toggleIcon.className = expanded
      ? "fas fa-chevron-up toggle-icon"
      : "fas fa-chevron-down toggle-icon";

    addressesContainer.classList.toggle("d-none");

    if (expanded && addressesContainer.innerHTML === "") {
      addressesContainer.appendChild(
        renderAddressList(container, territory.addresses || [])
      );
    }
  };

  /* ===== Return ===== */
  if (returnBtn && onReturn) {
    returnBtn.onclick = (e) => {
      e.stopPropagation();
      onReturn();
    };
  }

  /* ===== Selectable e checkbox ===== */
  if (selectable && onSelect && showCheckbox) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected;
    checkbox.className = "form-check-input me-2";

    card.querySelector(".territory-name").prepend(checkbox);

    checkbox.onchange = (e) => onSelect(e.target.checked);
  }

  return card;
}
