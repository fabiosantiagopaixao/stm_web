import { RestApiBase } from "../RestApiBase.js";

export class AssignmentsService extends RestApiBase {
  getAll() {
    return this.get("assignments");
  }
}
