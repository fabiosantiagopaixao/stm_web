import { AddressService } from "../../api/services/AddressService.js";
import { TerritoryAddressService } from "../../api/services/TerritoryAddressService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderAddressEdit } from "./address-edit.js";
import { showConfirmModal } from "../../components/modal.js";
import { setUpButtonAdd, removeButton } from "../util/PagesUtil.js";
import { renderAlertModal } from "../../components/renderAlertModal.js";
import { translate } from "../../util/TranslateUtil.js";

export async function loadAddress() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = translate("ADDRESS_TITLE");

  // Força o browser a renderizar
  await new Promise((resolve) => setTimeout(resolve, 0));

  showLoading(content, translate("LOADING_ADDRESS"));

  const service = new AddressService();
  const data = await service.getByCongregation();

  renderTable({
    container: content,
    columns: [
      { key: "gender", label: translate("COLUMN_GENDER"), width: "100px" },
      { key: "name", label: translate("COLUMN_NAME"), width: "200px" },
      { key: "address", label: translate("COLUMN_ADDRESS") },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    onView: (address) => renderAddressEdit(content, address, true),
    onEdit: (address) => renderAddressEdit(content, address),
    onDelete: (address) => onShowDialogDelete(address, content),
  });

  hideLoading(content);

  setUpButtonAdd({
    buttonId: "btnAdd", // id do botão
    content, // referência ao container/card
    onClick: (content) => {
      const newAddress = {
        id: null,
        name: null,
        address: null,
        gender: null,
        lat: null,
        lng: null,
        home_description: null,
        phone: null,
        age_type: null,
        deaf: null,
        mute: null,
        blind: null,
        sign: null,
        description: null,
        type: null,
        status: null,
        family_description: null,
      };
      renderAddressEdit(content, newAddress);
    },
  });

  removeButton("btnMap");
}

function onShowDialogDelete(address, content) {
  const confirmodal = showConfirmModal({
    title: translate("DELETE_ADDRESS_TITLE"),
    message: translate("DELETE_ADDRESS_MESSAGE").replace(
      "{name}",
      address.name
    ),
    primaryLabel: translate("DELETE_CONFIRM"),
    secondaryLabel: translate("DELETE_CANCEL"),
    onPrimary: () => onDeleteYes(address, content),
  });
  confirmodal.show();
}

async function onDeleteYes(address, content) {
  const service = new TerritoryAddressService();

  showLoading(content, translate("LOADING_DELETE_ADDRESS"));

  await service.deleteAddress(address);

  hideLoading(content);

  renderAlertModal(document.body, {
    type: "INFO",
    title: translate("ALERT_DELETE_SUCCESS_TITLE"),
    message: translate("ALERT_DELETE_SUCCESS_MESSAGE"),
  });

  loadAddress(); // recarrega a tabela
}
