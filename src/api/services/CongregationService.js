import { RestApiBase } from "../RestApiBase.js";

export class CongregationService extends RestApiBase {
  getAll() {
    return this.get("congregation");
  }
}
