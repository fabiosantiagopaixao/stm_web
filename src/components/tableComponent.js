export function renderTable({
  container,
  columns,
  data,
  onEdit,
  onDelete,
  pageList = [15, 30, 60, 100],
  heightOffset = 220 // espaço para navbar + padding
}) {
  const tableId = `table-${Date.now()}`;

  container.innerHTML = `
    <div class="table-responsive">
      <table id="${tableId}"
        class="table table-striped"
        data-search="true"
        data-pagination="true"
        data-page-list='${JSON.stringify(pageList)}'
        data-show-columns="true"
        data-show-refresh="true"
        data-show-fullscreen="true"
        data-click-to-select="true"
      ></table>
    </div>
  `;

  const tableHeight = window.innerHeight - heightOffset;

  const actionFormatter = (value, row) => {
    let html = `<div class="d-flex justify-content-end gap-2">`;
    if (onEdit) {
      html += `
        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${row.id}">
          <i class="bi bi-pencil"></i>
        </button>`;
    }
    if (onDelete) {
      html += `
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${row.id}">
          <i class="bi bi-trash"></i>
        </button>`;
    }
    html += `</div>`;
    return html;
  };

  const bootstrapColumns = [
    { field: 'state', checkbox: true },
    ...columns.map(col => ({
      field: col.key,
      title: col.label,
      sortable: true,
      align: col.align || 'left'
    })),
    ...(onEdit || onDelete
      ? [{
          field: 'actions',
          title: 'Actions',
          align: 'right',
          clickToSelect: false,
          formatter: actionFormatter
        }]
      : [])
  ];

  const $table = $(`#${tableId}`);

  $table.bootstrapTable({
    columns: bootstrapColumns,
    data,
    height: tableHeight,
    locale: 'en-US',
    pageSize: pageList[0],
    pagination: true
  });

  // Eventos
  $table.on('click', '.edit-btn', function () {
    onEdit?.(this.dataset.id);
  });

  $table.on('click', '.delete-btn', function () {
    onDelete?.(this.dataset.id);
    $table.bootstrapTable('remove', {
      field: 'id',
      values: [this.dataset.id]
    });
  });
}
