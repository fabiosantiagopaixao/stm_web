import { RestApiBase } from "../RestApiBase.js";

export class TerritoryService extends RestApiBase {
  getAll() {
    return this.get("territory");
  }
}
