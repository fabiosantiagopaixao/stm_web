import { normalize } from "../pages/util/PagesUtil.js";

export function renderSearchableCheckbox({
  containerId,
  items,
  readonlyMode = false,
  onChangeSelected = null, // callback que retorna IDs recém selecionados
  onChangeDeselected = null, // callback que retorna IDs desmarcados
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    ${
      !readonlyMode
        ? `<input type="text"
                  placeholder="Pesquisar"
                  class="search-input form-control mb-2"/>`
        : ""
    }
    <div class="checkbox-list"></div>
  `;

  const searchInput = container.querySelector(".search-input");
  const listContainer = container.querySelector(".checkbox-list");

  // Inicializa listas
  const selectedIds = [];
  const deselectedIds = [];

  // Marca o estado original
  items.forEach((item) => (item.originalSelected = !!item.selected));

  // Ordena items para que os que começaram selecionados apareçam no topo
  items.sort((a, b) => {
    return b.originalSelected - a.originalSelected;
  });

  const emitChanges = () => {
    onChangeSelected?.([...selectedIds]);
    onChangeDeselected?.([...deselectedIds]);
  };

  const renderList = (filter = "") => {
    listContainer.innerHTML = "";

    const filtered = items.filter(
      (item) =>
        normalize(item.name).includes(normalize(filter)) ||
        normalize(item.address).includes(normalize(filter))
    );

    filtered.forEach((item, index) => {
      const imageSrc = item.image || "../../img/user.png";

      const div = document.createElement("div");
      div.classList.add(
        "form-check",
        "d-flex",
        "align-items-center",
        "checkbox-item"
      );

      // Zebra: alterna cores com base no índice filtrado
      div.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#e6f2ff";
      div.style.padding = "5px";

      div.innerHTML = `
        <input class="form-check-input me-2"
               type="checkbox"
               id="chk_${item.id}"
               ${item.selected ? "checked" : ""}
               ${readonlyMode ? "disabled" : ""}>

        <img src="${imageSrc}" class="checkbox-avatar" 
             style="width:36px; height:36px; border-radius:50%; object-fit:cover; margin-right:10px;">

        <label class="form-check-label" for="chk_${item.id}">
          <strong>${item.name}</strong><br>
          <small class="text-muted">${item.address}</small>
        </label>
      `;

      if (!readonlyMode) {
        const checkbox = div.querySelector("input");
        checkbox.addEventListener("change", (e) => {
          const isChecked = e.target.checked;

          if (isChecked) {
            item.selected = true;

            // remove da lista de desmarcados se necessário
            const deselectIndex = deselectedIds.indexOf(item.id);
            if (deselectIndex > -1) deselectedIds.splice(deselectIndex, 1);

            // adiciona na lista de selecionados se não era original
            if (!item.originalSelected && !selectedIds.includes(item.id)) {
              selectedIds.push(item.id);
            }
          } else {
            item.selected = false;

            // adiciona na lista de desmarcados se era original
            if (item.originalSelected && !deselectedIds.includes(item.id)) {
              deselectedIds.push(item.id);
            }

            // remove da lista de selecionados se estava
            const selectIndex = selectedIds.indexOf(item.id);
            if (selectIndex > -1) selectedIds.splice(selectIndex, 1);
          }

          emitChanges();
        });
      }

      listContainer.appendChild(div);
    });
  };

  if (!readonlyMode && searchInput) {
    searchInput.addEventListener("input", (e) => renderList(e.target.value));
  }

  renderList();
  emitChanges(); // envia o estado inicial
}
