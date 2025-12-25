import { RestApiBase } from "../RestApiBase.js";

export class AddressService extends RestApiBase {
  getAll() {
    return this.get("address");
  }
}
