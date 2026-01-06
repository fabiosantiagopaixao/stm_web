import { AddressService } from "../../api/services/AddressService.js";
import { TerritoryAddressService } from "../../api/services/TerritoryAddressService.js";
import { showLoading, hideLoading } from "../../components/loading.js";
import { renderTable } from "../../components/table.js";
import { renderAddressEdit } from "./address-edit.js";
import { showConfirmModal } from "../../components/modal.js";
import { setUpButtonAdd } from "../util/PagesUtil.js";
import { renderAlertModal } from "../../components/renderAlertModal.js";

export async function loadAddress() {
  const content = document.getElementById("card-data");
  document.getElementById("pageTitle").innerText = "Direcciones";

  showLoading(content, "Cargando Direcciones");

  const service = new AddressService();
  const data = await service.getByCongregation();

  renderTable({
    container: content,
    columns: [
      { key: "gender", label: "Género", width: "100px" },
      { key: "name", label: "Nombre", width: "200px" },
      { key: "address", label: "Dirección" },
    ],
    data,
    rowsOptions: [15, 30, 60, 100, 150],
    tableHeight: null,
    onView: (address) => renderAddressEdit(content, address, true),
    onEdit: (address) => renderAddressEdit(content, address),
    onDelete: (territory) => onShowDialogDelete(territory, content),
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
}

function onShowDialogDelete(address, content) {
  const confirmodal = showConfirmModal({
    title: "Eliminar Dirección",
    message: `¿Está seguro que desea eliminar la dirección <b>${address.name}</b>?`,
    primaryLabel: "Sí",
    secondaryLabel: "No",
    onPrimary: () => onDeleteYes(address, content),
  });
  confirmodal.show();
}

async function onDeleteYes(address, content) {
  const service = new TerritoryAddressService();

  showLoading(content, "Eliminando dirección");

  await service.deleteAddress(address);

  hideLoading(content);

  renderAlertModal(document.body, {
    type: "INFO",
    title: "Deletar Dirección",
    message: "Dirección deletada con sucesso!",
  });

  loadAddress(); // recarrega a tabela
}
