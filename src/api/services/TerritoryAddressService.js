import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { TerritoryService } from "./TerritoryService.js";
import { AddressService } from "./AddressService.js";
import { LoginService } from "../../api/LoginService.js";
import { translate } from "../../pages/util/TranslateUtil.js";
import { genderMap } from "../../pages/util/PagesUtil.js";

export class TerritoryAddressService {
  constructor() {
    const nameSheet = "territory_address";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    this.getApi = new GetApiBaseService(nameSheet);
    this.writeApi = new PostService(nameSheet);

    this.territoryService = new TerritoryService();
    this.addressService = new AddressService();
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  async getAddressesByTerritoryNumber(territoryNumber) {
    const result = [];
    const allAddress = await this.addressService.getByCongregation();
    for (const address of allAddress) {
      const territoriesAddresses =
        await this.getTerritoriesByAddressIdAndTerritoryNumber(
          address.id,
          territoryNumber
        );

      if (address) {
        const newsAddress = {
          id: address.id,
          name: address.name,
          gender: translate(address.gender),
          age_type: translate(address.age_type),
          address: address.address,
          image: this.#getImageBy(address.gender, address.age_type),
          selected: territoriesAddresses?.length > 0,
        };

        result.push(newsAddress);
      }
    }

    return result;
  }

  #getImageBy(gender, ageType) {
    const value = `/img/${genderMap?.[gender]?.[ageType] ?? "user.png"}`;
    if (!value) {
      value = "/img/man.png";
    }
    return value;
  }

  async getTerritoriesByAddressId(addressId) {
    const data = await this.getByCongregation();

    const list = data.filter((item) => item.address_id === addressId);

    const result = [];

    for (const item of list) {
      const address = await this.addressService.getAddressById(item.address_id);

      if (address) {
        result.push({
          ...item,
          address,
        });
      }
    }

    return result;
  }

  async getTerritoriesByAddressIdAndTerritoryNumber(
    addressId,
    territoryNumber
  ) {
    const data = await this.getByCongregation();

    const list = data.filter(
      (item) =>
        item.address_id === addressId &&
        item.territory_number === territoryNumber
    );

    const result = [];

    for (const item of list) {
      const address = await this.addressService.getAddressById(item.address_id);

      if (address) {
        result.push({
          ...item,
          address,
        });
      }
    }

    return result;
  }

  async getTerritoryAddressByAddressIdAndTerritoryNumber(
    addressId,
    territoryNumber
  ) {
    const data = await this.getByCongregation();

    // Retorna apenas o primeiro item que bate com os critérios
    const item = data.find(
      (entry) =>
        entry.address_id === addressId &&
        entry.territory_number === territoryNumber
    );

    return item ?? null; // retorna null se não encontrou
  }

  async getTerritoryAddressTerritoryNumber(territoryNumber) {
    const data = await this.getByCongregation();

    // Retorna apenas o primeiro item que bate com os critérios
    const items = data.filter(
      (entry) => entry.territory_number === territoryNumber
    );

    return items ?? []; // retorna null se não encontrou
  }

  async getTerritoryAddressAddresId(addressId) {
    const data = await this.getByCongregation();

    // Retorna apenas o primeiro item que bate com os critérios
    const items = data.filter((entry) => entry.address_id === addressId);

    return items ?? []; // retorna null se não encontrou
  }

  /* ========= WRITE ========= */
  async saveUpdateAllData(
    territory,
    selectedAddressesIds,
    deselectedAddressesIds
  ) {
    // 1️⃣ Atualizar o território
    const response = await this.territoryService.saveUpdate(territory);
    const idTerritory = territory.id ?? response.data.id;

    // 2️⃣ Deletar relacionamentos desmarcados
    await this.#deleteDeselectedRelationships(
      territory,
      deselectedAddressesIds
    );

    // 3️⃣ Criar relacionamentos selecionados
    await this.#createSelectedRelationships(territory, selectedAddressesIds);
  }

  /* ================== Métodos privados ================== */

  async #deleteDeselectedRelationships(territory, deselectedAddressesIds) {
    for (const addressId of deselectedAddressesIds) {
      const territoryAddress =
        await this.getTerritoryAddressByAddressIdAndTerritoryNumber(
          addressId,
          territory.number
        );

      if (territoryAddress) {
        await this.delete(territoryAddress); // ⬅️ passa o objeto correto para deletar
      }
    }
  }

  async #createSelectedRelationships(territory, selectedAddressesIds) {
    for (const addressId of selectedAddressesIds) {
      const territoryAddress = {
        territory_number: territory.number,
        address_id: addressId,
        congregation_number: territory.congregation_number,
      };

      await this.saveUpdate(territoryAddress);
    }
  }

  async getLastNumberPlus1() {
    this.getApi.clearCache();
    const data = await this.territoryService.getByCongregation();

    // Extrai os números removendo "T-" e converte para number
    const numbers = data
      .map((item) => item.number)
      .filter(Boolean)
      .map((value) => Number(value.replace("T-", "")))
      .filter((n) => !isNaN(n));

    const maxNumber = numbers.length ? Math.max(...numbers) : 0;

    const nextNumber = maxNumber + 1;
    return `T-${String(nextNumber).padStart(4, "0")}`;
  }

  async saveUpdate(territoryAddress) {
    if (territoryAddress.id) {
      return this.writeApi.put(territoryAddress);
    }
    return this.writeApi.post(territoryAddress);
  }

  async deleteTerritory(territory) {
    // Bsucar lista relacionada
    const items = await this.getTerritoryAddressTerritoryNumber(
      territory.number
    );
    for (const territoryAddress of items) {
      await this.delete(territoryAddress.id);
    }
    await this.territoryService.delete(territory.id);
  }

  async deleteAddress(address) {
    // Bsucar lista relacionada
    const items = await this.getTerritoryAddressAddresId(address.id);
    for (const territoryAddress of items) {
      await this.delete(territoryAddress.id);
    }
    await this.addressService.delete(address.id);
  }

  async delete(id) {
    return this.writeApi.delete(id);
  }
}
