import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { navigateTo, initRouteDefault } from "./route.js";
import { showConfirmModal } from "../components/modal.js";
import { normalizeUrl } from "./util/PagesUtil.js";
import { applyI18n } from "../util/i18n.js";
import { translate } from "../util/TranslateUtil.js";

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
});

/* 🔹 BASE PATH (Vite) */
let BASE_PATH = import.meta.env.BASE_URL || "/";
if (!BASE_PATH.includes("localhost") && BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
} else {
  // Se não termina com "/", adiciona
  if (!BASE_PATH.endsWith("/")) {
    BASE_PATH += "/";
  }
}

/* 🔹 USER IMAGE */
const userLogoMan = `${BASE_PATH}/img/profile_man.svg`;

/* 🔹 SERVICE */
const loginService = new LoginService();
const user = loginService.getLoggedUser();

/* 🔹 AUTH GUARD */
if (!user) {
  // Usuário não logado → redireciona para login
  window.location.replace(normalizeUrl(`${BASE_PATH}/`));
} else {
  // 🔹 USER DATA
  applyMenuPermissions(user.type);
  document.getElementById("userName").innerText = user.name;
  document.getElementById("nameCongregation").innerText =
    user.congregation_name;
  document.getElementById("userLogo").src = userLogoMan;

  /* 🔹 LOGOUT MODAL DINÂMICO */
  const logoutModal = showConfirmModal({
    id: "logoutModal",
    title: translate("LOGOUT_MODAL_TITLE"),
    message: translate("LOGOUT_MODAL_MESSAGE"),
    primaryLabel: translate("LOGOUT_MODAL_PRIMARY"),
    secondaryLabel: translate("LOGOUT_MODAL_SECONDARY"),
    onPrimary: () => {
      showLoading(null, translate("LOGOUT_LOADING"));
      loginService.logout();
      hideLoading();
      window.location.replace(normalizeUrl(`${BASE_PATH}`));
    },
  });

  /* 🔹 BOTÃO LOGOUT */
  const logoutBtn = document.getElementById("logoutTopbar");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutModal.show();
    });
  }

  /* 🔹 INIT SPA */
  initRouteDefault(); // carrega home por padrão

  /* 🔹 SPA NAVIGATION - CLIQUES NO MENU */
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-page]");
    if (!link) return;
    e.preventDefault();
    const page = link.dataset.page;
    navigateTo(page);
  });
}

/**
 * Aplica visibilidade de menus e headings da sidebar
 * com base no tipo de usuário.
 */
function applyMenuPermissions(userType) {
  // Mapeamento de visibilidade por tipo de usuário
  const permissions = {
    ADMINISTRATOR: [
      "MENU_ADMINISTRATOR",
      "MENU_USERS",
      "MENU_ADDRESS",
      "MENU_TERRITORY",
      "MENU_ASSIGNMENTS",
      "MENU_DEFAULT",
      "MENU_MY_ASSIGNMENTS",
      "MENU_DIVIDER1",
      "MENU_DIVIDER2",
      "MENU_DIVIDER3",
      "MENU_DIVIDER4",
    ],
    AUXILIARY: [
      "MENU_ADMINISTRATOR",
      "MENU_DIVIDER1",
      "MENU_DIVIDER2",
      "MENU_ASSIGNMENTS",
      "MENU_MY_ASSIGNMENTS",
      "MENU_DEFAULT",
    ],
    PUBLISHER: [
      "MENU_DIVIDER1",
      "MENU_DIVIDER2",
      "MENU_DEFAULT",
      "MENU_MY_ASSIGNMENTS",
    ],
    CIRCUIT_OVERSEER: [
      "MENU_DIVIDER1",
      "MENU_DIVIDER2",
      "MENU_DEFAULT",
      "MENU_MY_ASSIGNMENTS",
    ],
  };

  const allowedMenus = permissions[userType] || [];

  // Seleciona todos os elementos que tenham data-role começando com MENU
  document.querySelectorAll("[data-role^='MENU']").forEach((el) => {
    const role = el.getAttribute("data-role");
    if (!allowedMenus.includes(role)) {
      el.style.display = "none"; // esconde menu ou heading
    } else {
      el.style.display = "block"; // mostra se permitido
    }
  });
}
