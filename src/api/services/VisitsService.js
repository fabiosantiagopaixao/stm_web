import { RestApiBase } from "../RestApiBase.js";

export class VisitsService extends RestApiBase {
  getAll() {
    return this.get("visits");
  }
}
