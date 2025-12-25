import { RestApiBase } from "../RestApiBase.js";

export class UserService extends RestApiBase {
  getAll() {
    return this.get("user");
  }
}
