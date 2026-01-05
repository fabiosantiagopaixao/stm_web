import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";
import {
  getCurrentDateDDMMYYYY,
  formatDateToDDMMYYYY,
} from "../../pages/util/PagesUtil.js";

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

  async getAssigmentByTerritoryNumber(territoryNumber) {
    const data = await this.getByCongregation();
    const item = data.find(
      (item) =>
        item.territory === territoryNumber &&
        (item.date_end === "" || item.date_end === null)
    );
    return item ?? null;
  }

  async isTerritoryAssigned(territory) {
    return territory != null;
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

  async returnTerritory(assignment) {
    if (assignment) {
      assignment.date_begin = formatDateToDDMMYYYY(assignment.date_begin);
      assignment.date_end = getCurrentDateDDMMYYYY();
      this.saveUpdate(assignment);

      localStorage.removeItem("stm_data_address");
      localStorage.removeItem("stm_data_territory");
      localStorage.removeItem("stm_data_assignments");
    }
  }
}
