import { RestApiBase } from "../RestApiBase.js";

export class NewsService extends RestApiBase {
  getAll() {
    return this.get("news");
  }
}
