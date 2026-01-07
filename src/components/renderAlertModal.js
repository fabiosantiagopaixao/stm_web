import { translate } from "../util/TranslateUtil.js";

export function renderAlertModal(container, options = {}) {
  const {
    id = "alertModal",
    type = "INFO",
    titleKey = "ALERT",
    messageKey = null,
    message = "",
    buttons = [
      {
        textKey: "OK",
        className: "btn btn-primary",
        dismiss: true,
      },
    ],
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
          <h5 class="modal-title">
            ${iconHtml}${translate(titleKey)}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          ${messageKey ? translate(messageKey) : message}
        </div>
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
                ${btn.textKey ? translate(btn.textKey) : btn.text}
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
