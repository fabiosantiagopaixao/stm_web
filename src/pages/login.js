import { CongregationService } from "../api/services/CongregationService.js";
import { LoginService } from "../api/LoginService.js";
import { showLoading, hideLoading } from "../components/loading.js";
import { showDialog } from "../components/dialog.js";
import { enableEnterNavigation, normalizeUrl } from "./util/PagesUtil.js";
import { translate } from "../util/TranslateUtil.js";

/* 🔹 BASE PATH (Vite dev/prod) */
let BASE_PATH = import.meta.env.BASE_URL || "/";
if (!BASE_PATH.includes("localhost") && BASE_PATH.endsWith("/")) {
  BASE_PATH = BASE_PATH.slice(0, -1);
} else if (!BASE_PATH.endsWith("/")) {
  BASE_PATH += "/";
}

/* 🔹 UTIL: delay async */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* 🔹 RENDER LOGIN */
export async function renderLogin() {
  showLoading(null, translate("LOADING_STM_LOGIN"));

  const app = document.getElementById("app");
  const pageTop = document.getElementById("page-top");

  const loginService = new LoginService();
  const congregationService = new CongregationService();

  localStorage.removeItem("stm_data_congregation");
  if (pageTop) pageTop.innerHTML = "";

  app.innerHTML = `
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card p-4 shadow" style="width: 360px;">
        <div class="text-center mb-3">
          <img src="${BASE_PATH}/img/logo.png" style="max-width:120px;">
        </div>

        <h4 class="text-center text-primary mb-4">${translate(
          "LOGIN_TITLE"
        )}</h4>

        <!-- 🔹 LISTA DE BANDEIRAS -->
        <div id="countryList" class="d-flex justify-content-center mb-4">
          <img src="${BASE_PATH}/img/brazil_flag.png" class="country-flag me-2" data-code="BR" title="Brazil">
          <img src="${BASE_PATH}/img/bolivia_flag.png" class="country-flag" data-code="BO" title="Bolivia">
        </div>

        <div class="mb-3">
          <select id="congregation" class="form-select" disabled>
            <option value="">${translate("SELECT_CONGREGATION")}</option>
          </select>
          <div class="invalid-feedback">${translate(
            "CONGREGATION_REQUIRED"
          )}</div>
        </div>

        <div class="mb-3">
          <input id="username" class="form-control" placeholder="${translate(
            "USERNAME_PLACEHOLDER"
          )}" disabled>
          <div class="invalid-feedback">${translate("USERNAME_REQUIRED")}</div>
        </div>

        <div class="mb-3">
          <input id="password" type="password" class="form-control" placeholder="${translate(
            "PASSWORD_PLACEHOLDER"
          )}" disabled>
          <div class="invalid-feedback">${translate("PASSWORD_REQUIRED")}</div>
        </div>

        <button id="loginBtn" class="btn btn-primary w-100" disabled>${translate(
          "LOGIN_BUTTON"
        )}</button>
      </div>
    </div>
  `;

  hideLoading();
  attachInputListeners();

  const congregationSelect = document.getElementById("congregation");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginBtn = document.getElementById("loginBtn");
  const flags = document.querySelectorAll(".country-flag");

  const countryKeyStorage = "stm_country";

  const loadCongregations = async () => {
    showLoading(null, translate("LOADING_FETCH_CONGREGATIONS"));
    congregationSelect.disabled = true;
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    loginBtn.disabled = true;

    let congregations = [];
    try {
      congregations = await congregationService.getAll();
    } catch (err) {
      hideLoading();

      const storedCountry = localStorage.getItem(countryKeyStorage);
      let msg = translate("ERROR_FETCH_CONGREGATIONS_BO");
      if (storedCountry === "BR")
        msg = translate("ERROR_FETCH_CONGREGATIONS_BR");

      showDialog({ type: "ERROR", message: msg });
      return;
    }

    hideLoading();

    congregationSelect.innerHTML =
      `<option value="">${translate("SELECT_CONGREGATION")}</option>` +
      congregations
        .map(
          (c) => `<option value="${c.number}">${c.name} (${c.city})</option>`
        )
        .join("");

    congregationSelect.disabled = false;
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    loginBtn.disabled = false;

    usernameInput.focus();
  };

  // Bandeiras
  flags.forEach((flag) => {
    flag.addEventListener("click", async () => {
      localStorage.removeItem("stm_data_congregation");
      localStorage.removeItem("stm_country");
      flags.forEach((f) => f.classList.remove("selected"));
      flag.classList.add("selected");

      const countryCode = flag.dataset.code;
      localStorage.setItem(countryKeyStorage, countryCode);

      await loadCongregations();
    });
  });

  const storedCountry = localStorage.getItem(countryKeyStorage);
  if (storedCountry) {
    const flagToSelect = Array.from(flags).find(
      (f) => f.dataset.code === storedCountry
    );
    if (flagToSelect) {
      flagToSelect.classList.add("selected");
      await loadCongregations(storedCountry);
    }
  }

  const fields = [congregationSelect, usernameInput, passwordInput];
  enableEnterNavigation(fields, async () => {
    if (!validateInputs()) return;
    loginBtn.click();
  });

  loginBtn.onclick = async () => {
    if (!validateInputs()) return;
    await handleLogin(loginService);
  };
}

/* 🔹 VALIDA INPUTS */
function validateInputs() {
  let valid = true;
  const congregation = document.getElementById("congregation");
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  [congregation, username, password].forEach((el) =>
    el.classList.remove("is-invalid")
  );

  if (!congregation.value) {
    congregation.classList.add("is-invalid");
    valid = false;
  }
  if (!username.value.trim()) {
    username.classList.add("is-invalid");
    valid = false;
  }
  if (!password.value.trim()) {
    password.classList.add("is-invalid");
    valid = false;
  }

  return valid;
}

/* 🔹 REMOVE ERRO AO DIGITAR */
function attachInputListeners() {
  const fields = [
    document.getElementById("congregation"),
    document.getElementById("username"),
    document.getElementById("password"),
  ];

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.value.trim() || (field.tagName === "SELECT" && field.value)) {
        field.classList.remove("is-invalid");
      }
    });
  });
}

/* 🔹 LOGIN */
async function handleLogin(loginService) {
  const start = Date.now();
  showLoading(null, translate("LOGIN_BUTTON"));

  try {
    const congregationId = document.getElementById("congregation").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const user = await loginService.login(congregationId, username, password);

    const elapsed = Date.now() - start;
    if (elapsed < 1500) await wait(1500 - elapsed);

    hideLoading();

    if (user) {
      window.location.replace(normalizeUrl(`${BASE_PATH}home`));
    } else {
      showDialog({
        type: "ERROR",
        message: translate("ERROR_INVALID_CREDENTIALS"),
      });
    }
  } catch (err) {
    hideLoading();
    showDialog({ type: "ERROR", message: translate("ERROR_LOGIN") });
  }
}
