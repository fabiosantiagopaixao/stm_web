import { ApiBaseService } from "./ApiBaseService.js";

const SHEET_BY_COUNTRY = {
  BO: "AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad",
  BR: "AKfycbzplhjuuPVY6Zayt1UXuVcH_NmvzU-7L9CB_V9VIdh66vQ0IKbAazvy7tYofPMJ2PUNgg", // fabio.saniago99@gmail.com
};

export class GetApiBaseService extends ApiBaseService {
  constructor(sheet = "") {
    super(sheet);

    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.execSheet = "/exec?sheet=";
  }

  /* ======= URL HELPERS (GET) ======= */

  #getBaseUrl() {
    if (!this.sheet) throw new Error("Sheet name not defined");

    const defaultCountry = localStorage.getItem("stm_country") ?? "BO";
    const idSheet = SHEET_BY_COUNTRY[defaultCountry];
    if (!idSheet) throw new Error("Sheet id not defined");

    return `${this.scriptGoogleUrl}${idSheet}${this.execSheet}${this.sheet}`;
  }

  #getBaseUrlWithCongregation(congregationNumber) {
    if (!congregationNumber) {
      throw new Error("Congregation Number not defined");
    }

    return `${this.#getBaseUrl()}&congregation_number=${congregationNumber}`;
  }

  /* ======= GET ======= */

  async get() {
    const cache = this.getCache();
    if (cache) return cache;

    const res = await fetch(this.#getBaseUrl());
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.setCache(data);

    return data;
  }

  async getByCongregation(congregationNumber) {
    const cache = this.getCache();
    if (cache) return cache;

    const res = await fetch(
      this.#getBaseUrlWithCongregation(congregationNumber)
    );
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.setCache(data);

    return data;
  }
}
