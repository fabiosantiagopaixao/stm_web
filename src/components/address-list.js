import { renderAddressEdit } from "../pages/address/address-edit.js";
import { translate } from "../util/TranslateUtil.js";

export function renderAddressList(
  containerPrincipal,
  addresses = [],
  { onClick } = {}
) {
  let BASE_PATH = import.meta.env.BASE_URL || "/";
  if (BASE_PATH.endsWith("/")) BASE_PATH = BASE_PATH.slice(0, -1);

  const zebraColors = ["#ffffff", "#fedfbcff"]; // branco e laranja claro
  const container = document.createElement("div");
  container.className = "address-list p-2";

  if (addresses.length === 0) {
    container.innerHTML = `<div class="text-muted small">${translate(
      "NO_ADDRESSES"
    )}</div>`;
    return container;
  }

  addresses.forEach((address, index) => {
    const row = document.createElement("div");
    row.className =
      "d-flex align-items-center gap-2 border-bottom py-2 address-row";

    // Alterna cor conforme índice
    row.style.backgroundColor = zebraColors[index % zebraColors.length];
    row.style.borderRadius = "10px";
    row.style.marginBottom = "4px";
    row.style.padding = "6px";
    row.style.cursor = "pointer"; // mostra que é clicável

    const img = `${BASE_PATH}${address.image || "/img/user.png"}`;
    row.innerHTML = `
      <img src="${img}" width="28" />
      <div>
        <div class="fw-bold small">${address.name || translate("UNKNOWN")}</div>
        <div class="text-muted small">${
          address.address || translate("NO_ADDRESS")
        }</div>
      </div>
    `;

    // ===== Evento interno =====
    row.onclick = () => {
      if (onClick && typeof onClick === "function") {
        onClick(address);
      } else {
        renderAddressEdit(containerPrincipal, address, true);
      }
    };

    container.appendChild(row);
  });

  return container;
}
