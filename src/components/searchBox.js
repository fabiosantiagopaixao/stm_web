export function renderSearchableCheckbox({
  containerId,
  items,
  onChange,
  readonlyMode = false,
}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <input type="text" placeholder="Pesquisar..." class="search-input form-control mb-2" ${
      readonlyMode ? "disabled" : ""
    }/>
    <div class="checkbox-list" style="max-height:300px; overflow-y:auto; border:1px solid #ccc; padding:5px; border-radius:5px;"></div>
  `;

  const searchInput = container.querySelector(".search-input");
  const listContainer = container.querySelector(".checkbox-list");

  const renderList = (filter = "") => {
    listContainer.innerHTML = "";

    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.address.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach((item) => {
      const div = document.createElement("div");
      div.classList.add("form-check", "mb-1");

      // checkbox marcado se item.selected for true, desabilitado se readonlyMode
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${
          item.id
        }" id="chk_${item.id}"
               ${item.selected ? "checked" : ""} ${
        readonlyMode ? "disabled" : ""
      }>
        <label class="form-check-label custom" for="chk_${item.id}">
          ${item.name} (${item.address})
        </label>
      `;

      const checkbox = div.querySelector("input");
      if (!readonlyMode) {
        checkbox.addEventListener("change", (e) => {
          item.selected = e.target.checked; // atualiza diretamente no item
          onChange(items); // retorna a lista inteira atualizada
        });
      }

      listContainer.appendChild(div);
    });
  };

  if (!readonlyMode) {
    searchInput.addEventListener("input", (e) => renderList(e.target.value));
  }

  renderList();
}
