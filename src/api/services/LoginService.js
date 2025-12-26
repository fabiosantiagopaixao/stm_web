import { UserService } from "./UserService.js";
import { TerritoryService } from "./TerritoryService.js";
import { AddressService } from "./AddressService.js";

const STORAGE_KEY = "stm_logged_user";

export class LoginService {
  constructor() {
    this.userService = new UserService();
    this.territoryService = new TerritoryService();
    this.addressService = new AddressService();
  }

  async login(congregationNumber, username, password) {
    const users = await this.userService.getByCongregation(congregationNumber);

    if (!Array.isArray(users)) return null;

    const user = users.find(u =>
      String(u.congregation_number) === String(congregationNumber) &&
      u.user === username &&
      String(u.password) === password &&
      u.active === true
    );

    if (!user) return null;

    this.saveUser(user);
    return user;
  }

  saveUser(user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  getLoggedUser() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLogged() {
    return !!this.getLoggedUser();
  }

  logout() {
    this.userService.clearStorage();
    this.territoryService.clearStorage();
    this.addressService.clearStorage();
    localStorage.removeItem(STORAGE_KEY);
  }
}
