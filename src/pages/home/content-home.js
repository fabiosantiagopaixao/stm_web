import { translate } from "../../util/TranslateUtil.js";

export function loadHome() {
  const btnAdd = document.getElementById("btnAdd");
  btnAdd.classList.add("noneButton");

  // Substitui o título da página
  document.getElementById("pageTitle").innerText = translate("PAGE_HOME_TITLE");

  // Substitui o conteúdo do card com título e descrição
  document.getElementById("card-data").innerHTML = `
    <div class="container mt-5 text-center">
      <h1 class="display-4 mb-3">${translate("HOME_WELCOME_TITLE")}</h1>
      <p class="lead">
        ${translate("HOME_WELCOME_DESC")}
      </p>
    </div>
  `;
}
