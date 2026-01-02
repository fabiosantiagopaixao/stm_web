export function removeAddButton() {
  const btnAdd = document.getElementById("btnAdd");
  if (!btnAdd) return;

  btnAdd.classList.add("noneButton");
}

export function setUpButtonAdd({ buttonId = "btnAdd", content, onClick }) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.classList.remove("noneButton");

  btn.onclick = (e) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(content);
    }
  };
}

/**
 * Permite navegar pelos inputs de um formulário usando Enter.
 * @param {HTMLElement[]} fields - Array de inputs/selects do formulário, na ordem.
 * @param {Function} onLastEnter - Função a ser executada quando o usuário apertar Enter no último campo.
 */
export function enableEnterNavigation(fields, onLastEnter) {
  fields.forEach((field, index) => {
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const nextField = fields[index + 1];
        if (nextField) {
          nextField.focus();
        } else if (typeof onLastEnter === "function") {
          onLastEnter(); // dispara a ação no último input
        }
      }
    });
  });
}
