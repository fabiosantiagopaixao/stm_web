import BO from "./languages/es.js";
import BR from "./languages/pt_br.js";

const country = localStorage.getItem("stm_country") ?? "BO";

const TRANSLATIONS = { BO, BR };

export function translate(key, params = {}) {
  let str = TRANSLATIONS[country]?.[key] ?? key;

  // Substitui placeholders {param} pelo valor em params
  Object.keys(params).forEach((paramKey) => {
    const regex = new RegExp(`\\{${paramKey}\\}`, "g");
    str = str.replace(regex, params[paramKey]);
  });

  return str;
}
