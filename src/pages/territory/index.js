import { TerritoryService } from "../../api/services/TerritoryService.js";
import { TerritoryAddressService } from "../../api/services/TerritoryAddressService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderTerritoryEdit } from "./territory-edit.js";
import { showConfirmModal } from "../../components/modal.js";
import { setUpButtonAdd, removeButton } from "../util/PagesUtil.js";
import { renderAlertModal } from "../../components/renderAlertModal.js";
import { translate } from "../../util/TranslateUtil.js";

export async function loadTerritory() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText =
    translate("TERRITORIES_TITLE");

  // Força o browser a renderizar
  await new Promise((resolve) => setTimeout(resolve, 0));

  showLoading(content, translate("LOADING_TERRITORIES"));

  const service = new TerritoryService();
  const data = await service.getByCongregation();

  hideLoading(content);

  renderTable({
    container: content,
    columns: [
      { key: "number", label: translate("NUMBER") },
      { key: "name", label: translate("NAME") },
      { key: "type", label: translate("TYPE") },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],

    onView: (territory) => renderTerritoryEdit(content, territory, true),

    onEdit: (territory) => renderTerritoryEdit(content, territory),

    onDelete: (territory) => onShowDialogDelete(territory, content),
  });

  setUpButtonAdd({
    buttonId: "btnAdd",
    content,
    onClick: (content) => {
      const newTerritory = {
        id: null,
        number: "",
        name: "",
        password: "",
        type: "HOUSE_TO_HOUSE",
      };
      renderTerritoryEdit(content, newTerritory);
    },
  });

  removeButton("btnMap");
}

/* 🔹 CONFIRMAÇÃO DE EXCLUSÃO */
function onShowDialogDelete(territory, content) {
  const confirmModal = showConfirmModal({
    title: translate("DELETE_TERRITORY_TITLE"),
    message: translate("DELETE_TERRITORY_MESSAGE", {
      number: territory.number,
    }),
    primaryLabel: translate("YES"),
    secondaryLabel: translate("NO"),
    onPrimary: () => onDeleteYes(territory, content),
  });

  confirmModal.show();
}

/* 🔹 EXCLUSÃO */
async function onDeleteYes(territory, content) {
  const service = new TerritoryAddressService();

  showLoading(content, translate("DELETING_TERRITORY"));

  await service.deleteTerritory(territory);

  hideLoading(content);

  renderAlertModal(document.body, {
    type: "INFO",
    title: translate("DELETE_TERRITORY_SUCCESS_TITLE"),
    message: translate("DELETE_TERRITORY_SUCCESS_MESSAGE"),
  });

  loadTerritory(); // recarrega a tabela
}
