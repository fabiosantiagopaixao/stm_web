import { translate } from "../util/TranslateUtil.js";

function applyI18n(root = document) {
  // Texto interno
  root.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    el.textContent = translate(key);
  });

  // Title
  root.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.dataset.i18nTitle;
    el.setAttribute("title", translate(key));
  });

  // Placeholder
  root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    el.setAttribute("placeholder", translate(key));
  });

  // Aria-label
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    el.setAttribute("aria-label", translate(key));
  });
}

export { applyI18n };
