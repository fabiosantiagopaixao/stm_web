import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class AssignmentsService {
  constructor() {
    const nameSheet = "assignments";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    this.getApi = new GetApiBaseService(nameSheet);
    this.writeApi = new PostService(nameSheet);
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  /* ========= WRITE ========= */
  async saveUpdate(assignment) {
    if (assignment.id) {
      return this.writeApi.put(assignment);
    }
    return this.writeApi.post(assignment);
  }

  async delete(assignment) {
    return this.writeApi.delete(assignment);
  }
}
