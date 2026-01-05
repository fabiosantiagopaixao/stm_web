import { GetApiBaseService } from "./base/GetApiBaseService.js";
import { PostService } from "./base/PostService.js";
import { ApiBaseService } from "./base/ApiBaseService.js";

export class UserService {
  constructor() {
    const nameSheet = "user";
    this.loggedUser = this.#getLoggedUser();

    this.getApi = new GetApiBaseService(nameSheet);
    this.writeApi = new PostService(nameSheet);
  }

  /* ========= READ ========= */
  async getByCongregation(congregationNumber) {
    if (this.loggedUser) {
      return this.getApi.getByCongregation(this.loggedUser.congregation_number);
    }
    return this.getApi.getByCongregation(congregationNumber);
  }

  async getUserByUserName(userName) {
    const users = await this.getByCongregation();
    const user = users.find((item) => item.user === userName);
    return user;
  }

  #getLoggedUser() {
    const data = localStorage.getItem("stm_logged_user");
    return data ? JSON.parse(data) : null;
  }

  /* ========= WRITE ========= */
  async saveUpdate(user) {
    if (user.id) {
      return this.writeApi.put(user);
    }
    return this.writeApi.post(user);
  }

  async delete(user) {
    return this.writeApi.delete(user);
  }

  static clearAllCacheLogout() {
    ApiBaseService.clearAllCacheLogout();
  }
}
