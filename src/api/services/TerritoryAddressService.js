import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { TerritoryService } from "./TerritoryService.js";
import { AssignmentsService } from "./AssignmentsService.js";
import { AddressService } from "./AddressService.js";
import { LoginService } from "../../api/LoginService.js";
import { genderMap } from "../../pages/util/PagesUtil.js";

export class TerritoryAddressService {
  constructor() {
    const nameSheet = "territory_address";
    this.loginService = new LoginService();

    this.loggedUser = this.loginService.getLoggedUser();

    this.getApi = new GetApiBaseService(nameSheet);
    this.writeApi = new PostService(nameSheet);

    this.territoryService = new TerritoryService();
    this.addressService = new AddressService();
    this.assignmentsService = new AssignmentsService();
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  #getImageBy(gender, ageType) {
    // Normaliza valores nulos ou vazios
    const g = gender?.trim() || null;
    const a = ageType?.trim() || null;

    // Tenta buscar a imagem no mapa
    const value =
      g && a && genderMap?.[g]?.[a]
        ? `/img/${genderMap[g][a]}`
        : "/img/user.png";

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

  async getAllAddressesByTerritoryNumberToEditAndAdd(territoryNumber) {
    const allAddress = await this.addressService.getByCongregation();
    const addresses = [];
    const territoryAddresses = await this.getTerritoryAddressTerritoryNumber(
      territoryNumber
    );

    for (const address of allAddress) {
      address.selected =
        territoryAddresses.find((ta) => ta.address_id === address.id) != null;
      address.image = this.#getImageBy(address.gender, address.age_type);
      addresses.push(address);
    }
    return addresses;
  }

  async getAddressesByTerritoryNumber(territoryNumber) {
    const territoryAddresses = await this.getTerritoryAddressTerritoryNumber(
      territoryNumber
    );

    const addresses = [];
    for (const ta of territoryAddresses) {
      const address = await this.addressService.getAddressById(ta.address_id);
      if (!address) continue;
      address.image = this.#getImageBy(address.gender, address.age_type);
      addresses.push(address);
    }

    return addresses;
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

  /**
   *
   * @returns Objetivo: Listar territorios com uma lista dentro de endereços,
   * se o territorio está designado booleano
   * nome de quem está com territorio
   */
  async listAllTerritories() {
    // ordenar
    let allTerritories = await this.territoryService.getByCongregation();
    allTerritories.sort((a, b) => {
      const numA = Number(a.number.replace(/\D/g, ""));
      const numB = Number(b.number.replace(/\D/g, ""));
      return numA - numB;
    });

    for (const territory of allTerritories) {
      // busca lista de endereços
      const addresses = await this.getAddressesByTerritoryNumber(
        territory.number
      );

      territory.addresses = addresses;

      // verifica se está asignado

      territory.nameAssigned = "";

      const assignment =
        await this.assignmentsService.getAssigmentByTerritoryNumber(
          territory.number
        );
      if (assignment) {
        const user = await this.loginService.getUserByUsername(
          assignment.publisher
        );
        territory.assignment = assignment;
        territory.nameAssigned = user.name;
        territory.isAssigned = true;
      } else {
        territory.isAssigned = false;
      }
    }

    return allTerritories;
  }

  /**
   *
   * @returns Objetivo: Listar territorios com uma lista dentro de endereços,
   * se o territorio está designado booleano
   * nome de quem está com territorio
   */
  async listMyTerritories() {
    const allTerritories = await this.listAllTerritories();
    const filterData = allTerritories.filter((item) =>
      this.#isMyAssigment(item)
    );
    return filterData;
  }

  #isMyAssigment(territory) {
    return (
      territory?.assignment &&
      this.loggedUser?.user === territory.assignment.publisher
    );
  }
}
