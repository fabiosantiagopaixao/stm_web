import { renderAddressList } from "./address-list.js";

export function renderTerritoryCard(
  container,
  territory,
  {
    selectable = false,
    selected = false,
    onSelect = null,
    onReturn = null,
    isAssigned = false,
    pageType = "MY_ASSIGNMENTS",
  } = {}
) {
  const shouldHighlightAssigned = pageType !== "MY_ASSIGNMENTS" && isAssigned;

  const card = document.createElement("div");
  card.className = `card territory-card mb-2 ${
    shouldHighlightAssigned ? "border-danger bg-light-danger" : ""
  }`;

  let BASE_PATH = import.meta.env.BASE_URL || "/";
  if (BASE_PATH.endsWith("/")) BASE_PATH = BASE_PATH.slice(0, -1);

  const typeIcon =
    territory.type === "PHONE"
      ? `${BASE_PATH}/img/phone.png`
      : `${BASE_PATH}/img/house.png`;

  let expanded = false;

  card.innerHTML = `
    <div class="card-body d-flex territory-header">

      <div class="territory-name d-flex align-items-center gap-2 toggle-area" style="width:65%">
        <img src="${typeIcon}" width="32" />
        <div>
          <div>${territory.name}</div>
        </div>
      </div>

      <div class="territory-info d-flex align-items-center text-end toggle-area" style="width:35%">
        ${
          onReturn
            ? `<a class="return-territory me-2" title="Return territory">
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

    <div class="territory-addresses d-none"></div>
  `;

  const toggleIcon = card.querySelector(".toggle-icon");
  const addressesContainer = card.querySelector(".territory-addresses");
  const returnBtn = card.querySelector(".return-territory");

  /* ===== TOGGLE APENAS NAS ÁREAS PERMITIDAS ===== */
  const toggleAreas = card.querySelectorAll(".toggle-area");

  toggleAreas.forEach((area) => {
    area.onclick = () => {
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
  });

  /* ===== RETURN ===== */
  if (returnBtn && onReturn) {
    returnBtn.onclick = (e) => {
      e.stopPropagation();
      onReturn(territory);
    };
  }

  /* ===== SELECT ===== */
  let canSelect =
    selectable && onSelect && (!isAssigned || pageType === "MY_ASSIGNMENTS");

  if (pageType === "MY_ASSIGNMENTS") {
    canSelect = false;
  }

  if (canSelect) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selected;
    checkbox.className = "form-check-input me-2";

    card.querySelector(".territory-name").prepend(checkbox);

    if (selected) {
      card.classList.add("selected");
    }

    checkbox.onclick = (e) => {
      e.stopPropagation();
    };

    checkbox.onchange = (e) => {
      const checked = e.target.checked;
      card.classList.toggle("selected", checked);
      onSelect(checked, territory);
    };
  }

  return card;
}
