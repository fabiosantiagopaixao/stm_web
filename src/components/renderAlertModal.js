export function renderAlertModal(container, options = {}) {
  const {
    id = "alertModal",
    type = "INFO",
    title = "Attention",
    message = "",
    buttons = [{ text: "OK", className: "btn btn-primary", dismiss: true }],
  } = options;

  document.getElementById(id)?.remove();

  let iconHtml = "";
  switch (type.toUpperCase()) {
    case "ERROR":
      iconHtml = `<i class="fas fa-times-circle text-danger fa-2x me-2"></i>`;
      break;
    case "WARNING":
      iconHtml = `<i class="fas fa-exclamation-triangle text-warning fa-2x me-2"></i>`;
      break;
    default:
      iconHtml = `<i class="fas fa-info-circle text-primary fa-2x me-2"></i>`;
  }

  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = id;
  modal.tabIndex = -1;

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${iconHtml}${title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">${message}</div>
        <div class="modal-footer">
          ${buttons
            .map(
              (btn, i) => `
              <button
                type="button"
                class="${btn.className}"
                id="${id}-btn-${i}"
                ${btn.dismiss ? 'data-bs-dismiss="modal"' : ""}
              >
                ${btn.text}
              </button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  container.appendChild(modal);

  const modalInstance = new bootstrap.Modal(modal);

  buttons.forEach((btn, i) => {
    if (btn.action) {
      document
        .getElementById(`${id}-btn-${i}`)
        .addEventListener("click", btn.action);
    }
  });

  modalInstance.show();

  return modalInstance;
}
