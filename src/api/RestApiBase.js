// js/api/RestApiBase.js
export class RestApiBase {
  constructor() {
    this.scriptGoogleUrl = "https://script.google.com/macros/s/";
    this.idSheet =
      "AKfycbzEOzJtIfjKSDgSZftW-kq1Szxdqkait9x8SR7zzd71s3kDTo8n_bLgSDkhKo_c9tad";
    this.execSheet = "/exec?sheet=";
  }

  getBaseUrl(sheet) {
    return `${this.scriptGoogleUrl}${this.idSheet}${this.execSheet}${sheet}`;
  }

  async get(sheet) {
    const res = await fetch(this.getBaseUrl(sheet));
    if (!res.ok) throw new Error("GET error");
    return res.json();
  }

  async post(sheet, method, body) {
    const res = await fetch(
      `${this.getBaseUrl(sheet)}&method=${method}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    return res.json();
  }
}
