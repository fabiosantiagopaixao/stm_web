// components/Table.js
export function renderTable({
  container,
  columns,
  data,
  onEdit,
  onDelete,
  rowsOptions = [15, 30, 60, 100],
  tableHeight = null // opcional: altura da tabela
}) {
  let currentPage = 1;
  let rowsPerPage = rowsOptions[0];

  function render() {
    const start = (currentPage - 1) * rowsPerPage;
    const paginatedData = data.slice(start, start + rowsPerPage);

    // Calcula altura dinâmica se não passou tableHeight
    const contentTop = container.getBoundingClientRect().top;
    const dynamicHeight = tableHeight || (window.innerHeight - contentTop - 80) + "px"; // 80px para navbar/footer

    container.innerHTML = `
      <div class="table-responsive" style="height:${dynamicHeight}; overflow-x:auto; overflow-y:auto;">
        <table class="table table-striped table-hover mb-0">
          <thead class="table-secondary position-sticky top-0" style="z-index:10;">
            <tr>
              ${columns.map(c => `<th style="${c.width ? `width:${c.width}; min-width:${c.width};` : ''}">${c.label}</th>`).join('')}
              <th class="text-end" style="width:120px; min-width:120px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedData.map(row => `
              <tr>
                ${columns.map(c => `<td>${row[c.key]}</td>`).join('')}
                <td class="text-end text-nowrap" style="min-width:120px;">
                  ${onEdit ? `<button class="btn btn-sm btn-primary me-1" data-id="${row.id}" data-action="edit"><i class="bi bi-pencil"></i></button>` : ''}
                  ${onDelete ? `<button class="btn btn-sm btn-danger" data-id="${row.id}" data-action="delete"><i class="bi bi-trash"></i></button>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-2">
        <div>
          Show
          <select id="rowsPerPage" class="form-select d-inline-block w-auto">
            ${rowsOptions.map(r => `<option value="${r}" ${r === rowsPerPage ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
          entries
        </div>
        <div id="pagination" class="btn-group"></div>
      </div>
    `;

    // Evento select rows per page
    container.querySelector("#rowsPerPage").addEventListener("change", e => {
      rowsPerPage = parseInt(e.target.value);
      currentPage = 1;
      render();
    });

    // Paginação
    const paginationContainer = container.querySelector("#pagination");
    const totalPages = Math.ceil(data.length / rowsPerPage);
    paginationContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
      btn.textContent = i;
      btn.addEventListener("click", () => {
        currentPage = i;
        render();
      });
      paginationContainer.appendChild(btn);
    }

    // Ações de botão
    container.querySelectorAll("button[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        if (btn.dataset.action === "edit" && onEdit) onEdit(id);
        if (btn.dataset.action === "delete" && onDelete) onDelete(id);
      });
    });
  }

  // Redesenha tabela ao redimensionar a tela
  window.addEventListener("resize", () => render());

  render();
}
