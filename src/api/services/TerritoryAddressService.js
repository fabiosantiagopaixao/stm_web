import { RestApiBase } from "../RestApiBase.js";

export class TerritoryAddressService extends RestApiBase {
  getAll() {
    return this.get("territory_address");
  }
}
