import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { LoginService } from "../../api/LoginService.js";

export class TerritoryService {
  constructor() {
    const nameSheet = "territory";
    const loginService = new LoginService();
    this.loggedUser = loginService.getLoggedUser();

    this.getApi = new GetApiBaseService(nameSheet);
    this.writeApi = new PostService(nameSheet);
  }

  /* ========= READ ========= */
  async getByCongregation() {
    return this.getApi.getByCongregation(this.loggedUser.congregation_number);
  }

  async getTerritoryByNumber(number) {
    const data = await this.getByCongregation();
    return data.find((territory) => territory.number === number) || null;
  }

  /* ========= WRITE ========= */
  async saveUpdate(territory) {
    if (territory.id) {
      return this.writeApi.put(territory);
    }
    return this.writeApi.post(territory);
  }

  async delete(id) {
    return this.writeApi.delete(id);
  }
}
