import { UserService } from "../../api/services/UserService.js";
import { LoginService } from "../../api/LoginService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderUserEdit } from "./user-edit.js";
import { renderButton } from "../../components/button.js";
import { setUpButtonAdd, removeButton } from "../util/PagesUtil.js";
import { translate } from "../../util/TranslateUtil.js";

export async function loadUser() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = translate("USERS_TITLE");

  // Força o browser a renderizar
  await new Promise((resolve) => setTimeout(resolve, 0));

  showLoading(content, translate("LOADING_USERS"));

  const service = new UserService();
  const loginService = new LoginService();
  const userLogged = loginService.getLoggedUser();

  const data = await service.getByCongregation(userLogged.congregation_number);

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "name", label: translate("NAME") },
      { key: "user", label: translate("USER") },
      { key: "password", label: translate("PASSWORD") },
      { key: "active", label: translate("ACTIVE") },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    disableDelete: true,
    onView: (user) => renderUserEdit(content, user, true),
    onEdit: (user) => renderUserEdit(content, user),
    extraButtons: [
      (user) => createDeactivateUserButton(user, service, content),
    ],
  });

  setUpButtonAdd({
    buttonId: "btnAdd",
    content,
    onClick: (content) => {
      const newUser = {
        id: null,
        name: "",
        user: "",
        password: "",
        active: true,
        type: "PUBLISHER",
      };

      renderUserEdit(content, newUser);
    },
  });

  removeButton("btnMap");
}

/* 🔹 ALTERAR STATUS DO USUÁRIO */
async function onClickUserActivDeactivate(user, service, container) {
  const newStatus = !user.active;

  try {
    showLoading(container, translate("UPDATING_STATUS"));

    await service.put({ ...user, active: newStatus });
    user.active = newStatus;

    await loadUser();
  } catch (err) {
    alert(translate("ERROR_UPDATING_STATUS") + ": " + err.message);
  } finally {
    hideLoading(container);
  }
}

/* 🔹 BOTÃO CUSTOMIZADO ATIVAR / DESATIVAR */
function createDeactivateUserButton(user, service, container) {
  return renderButton({
    iconClass: user.active ? "fas fa-toggle-on" : "fas fa-toggle-off",
    colorClass: user.active ? "btn-success" : "btn-secondary",
    title: user.active ? translate("DEACTIVATE") : translate("ACTIVATE"),
    onClick: () => onClickUserActivDeactivate(user, service, container),
    extraAttributes: {
      "data-action": "toggle",
      "data-id": user.id,
    },
  });
}
