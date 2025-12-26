const STORAGE_KEY = "stm_data_";

export class RestApiBaseService {
  
  constructor(sheet = "") {
    this.sheet = sheet; // Nome da sheet padrão
    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.idSheet =
      "AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad";
    this.execSheet = "/exec?sheet=";
    this.keyStorage = STORAGE_KEY + this.sheet;
  }

  /* ======= MÉTODOS PRIVADOS ======= */
  #getBaseUrl(sheetName) {
    const sheetToUse = sheetName || this.sheet;
    if (!sheetToUse) throw new Error("Sheet name not defined");
    return `${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${sheetToUse}`;
  }

  #getBaseUrlWithCongregation(congregationNumber) {
    if (!congregationNumber) throw new Error("Congregation Number not defined");
    return `${this.#getBaseUrl(this.sheet)}&congregation_number=${congregationNumber}`;
  }

  #saveAsynStorage(data, congregationNumber = null) {
    const key = congregationNumber ? `${this.keyStorage}_${congregationNumber}` : this.keyStorage;
    localStorage.setItem(key, JSON.stringify(data));
  }

  #getAsynStorage(congregationNumber = null) {
    const key = congregationNumber ? `${this.keyStorage}_${congregationNumber}` : this.keyStorage;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }



  /* ======= MÉTODOS PÚBLICOS ======= */
  async get() {
    const dataStorage = this.#getAsynStorage();
    if (dataStorage) return dataStorage;

    const url = this.#getBaseUrl(this.sheet);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data);
    return data;
  }

  async getByCongregation(congregationNumber) {
    const dataStorage = this.#getAsynStorage(congregationNumber);
    if (dataStorage) return dataStorage;

    const url = this.#getBaseUrlWithCongregation(congregationNumber);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");

    const data = await res.json();
    if (data) this.#saveAsynStorage(data, congregationNumber);
    return data;
  }

  async post(method, body) {
    const res = await fetch(`${this.#getBaseUrl(this.sheet)}&method=${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("POST error");
    return res.json();
  }
  
  clearStorage(congregationNumber = null) {
    const key = congregationNumber ? `${this.keyStorage}_${congregationNumber}` : this.keyStorage;
    localStorage.removeItem(key);
  }

}
