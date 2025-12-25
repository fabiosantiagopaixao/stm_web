export function renderBootstrapTable({ container, columns, data, onEdit, onDelete, pageList = [15, 30, 60, 100] }) {
  // Cria a div para toolbar e tabela
  container.innerHTML = `
    <div id="toolbar" class="mb-2">
      <button id="remove" class="btn btn-danger" disabled>
        <i class="bi bi-trash"></i> Delete
      </button>
    </div>
    <table id="table"
      data-toolbar="#toolbar"
      data-search="true"
      data-show-refresh="true"
      data-show-toggle="true"
      data-show-fullscreen="true"
      data-show-columns="true"
      data-show-columns-toggle-all="true"
      data-detail-view="false"
      data-show-export="true"
      data-click-to-select="true"
      data-minimum-count-columns="2"
      data-show-pagination-switch="true"
      data-pagination="true"
      data-page-list='${JSON.stringify(pageList)}'
      data-show-footer="false"
      data-height="500"
    >
    </table>
  `;

  const $table = $('#table');
  const $remove = $('#remove');
  let selections = [];

  function getIdSelections() {
    return $.map($table.bootstrapTable('getSelections'), row => row.id);
  }

  function operateFormatter(value, row, index) {
    let html = '';
    if (onEdit) html += `<button class="btn btn-sm btn-primary edit-btn" data-id="${row.id}"><i class="bi bi-pencil"></i></button> `;
    if (onDelete) html += `<button class="btn btn-sm btn-danger delete-btn" data-id="${row.id}"><i class="bi bi-trash"></i></button>`;
    return html;
  }

  const tableColumns = [
    { field: 'state', checkbox: true },
    ...columns.map(col => ({ field: col.key, title: col.label, sortable: true })),
    { field: 'operate', title: 'Actions', align: 'center', clickToSelect: false, formatter: operateFormatter }
  ];

  $table.bootstrapTable('destroy').bootstrapTable({
    columns: tableColumns,
    data: data,
    height: 500,
    locale: 'en-US',
    showExport: true,
    exportTypes: ['csv', 'excel', 'pdf'],
    pagination: true,
    pageSize: pageList[0],
    pageList: pageList
  });

  // Ações edit/delete
  $table.off('click', '.edit-btn').on('click', '.edit-btn', function () {
    const id = $(this).data('id');
    onEdit && onEdit(id);
  });

  $table.off('click', '.delete-btn').on('click', '.delete-btn', function () {
    const id = $(this).data('id');
    onDelete && onDelete(id);
    $table.bootstrapTable('remove', { field: 'id', values: [id] });
  });

  $table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', () => {
    const selectedIds = getIdSelections();
    $remove.prop('disabled', selectedIds.length === 0);
    selections = selectedIds;
  });

  $remove.click(() => {
    $table.bootstrapTable('remove', { field: 'id', values: selections });
    $remove.prop('disabled', true);
  });
}
