import { UserService } from "../api/services/UserService.js";
import { LoginService } from "../api/services/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { renderTable } from "../components/Table.js";

export async function loadUser() {
  const content = document.getElementById("content");
  document.getElementById("pageTitle").innerText = "Users";

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
      { key: "id", label: "ID", width: "50px" },
      { key: "congregation_number", label: "Cong. Number", width: "100px" },
      { key: "congregation_name", label: "Congregation Name", width: "200px" },
      { key: "name", label: "Name", width: "150px" },
      { key: "user", label: "Username", width: "100px" },
      { key: "type", label: "Type", width: "100px" },
      { key: "active", label: "Active", width: "80px" }
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null, // altura dinâmica baseada na tela
    onEdit: id => alert("Edit User " + id),
    onDelete: id => {
      if (confirm("Are you sure you want to delete user " + id + "?")) {
        alert("Deleted User " + id);
      }
    }
  });
}
