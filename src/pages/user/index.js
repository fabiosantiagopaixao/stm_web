import { UserService } from "../../api/services/UserService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/Table.js";
import { renderUserEdit } from "./user-edit.js";

export async function loadUser() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Users";

  // Botão Adicionar
  const actionsContainer = document.getElementById("actionsButtons");
  if (actionsContainer) {
    actionsContainer.innerHTML = ""; // limpa se já existir
    const addButton = document.createElement("button");
    addButton.className = "btn btn-primary mb-3";
    addButton.innerHTML = `<i class="fas fa-plus"></i> Adicionar`;
    actionsContainer.appendChild(addButton);

    addButton.addEventListener("click", () => {
      renderUserEdit(content, null, false); // null = criar novo usuário
    });
  }

  // Mostra loading
  showLoading(content, "Loading Users...");

  const service = new UserService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();
  const data = await service.getByCongregation(userLogged.congregation_number);

  // Remove loading
  hideLoading(content);

  // Renderiza a tabela usando o componente genérico
  renderTable({
    container: content,
    columns: [
      { key: "name", label: "Name", width: "150px" },
      { key: "user", label: "Usuario", width: "100px" },
      { key: "password", label: "Contraseña", width: "100px" },
      { key: "active", label: "Activo", width: "80px" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    disableDelete: true,
    onView: (user) => renderUserEdit(content, user, true),
    onEdit: (user) => renderUserEdit(content, user, false),
    onDelete: (id) => {
      if (confirm("Are you sure you want to delete user " + id + "?")) {
        alert("Deleted User " + id);
      }
    },
  });
}
