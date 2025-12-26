export class RestApiBaseService {
  constructor(sheet = "") {
    this.sheet = sheet; // Nome da sheet padrão
    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.idSheet =
      "AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad";
    this.execSheet = "/exec?sheet=";
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

  /* ======= MÉTODOS PÚBLICOS ======= */
  async get() {
    const url = this.#getBaseUrl(this.sheet);

    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");
    return res.json();
  }

  async getByCongregation(congregationNumber) {
    const url = this.#getBaseUrlWithCongregation(congregationNumber);
    const res = await fetch(url);
    if (!res.ok) throw new Error("GET error");
    return res.json();
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
}
