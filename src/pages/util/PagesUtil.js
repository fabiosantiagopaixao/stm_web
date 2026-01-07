/* ================= Gender Map ================= */
export const genderMap = {
  Male: {
    CHILD: "child_man.png",
    YOUNG: "young_man.png",
    ADULT: "man.png",
    SENIOR: "senior_man.png",
  },
  Female: {
    CHILD: "child_woman.png",
    YOUNG: "young_woman.png",
    ADULT: "woman.png",
    SENIOR: "senior_woman.png",
  },
};

/* ================= Botões ================= */
function toggleButtonVisibility(button, show) {
  if (!button) return;
  button.classList.toggle("noneButton", !show);
}

function setButtonClick(button, callback, content, label) {
  if (!button) return;
  if (label !== undefined) button.textContent = label;
  button.onclick = (e) => {
    e.preventDefault();
    if (typeof callback === "function") callback(content);
  };
}

/**
 * Exibe um botão e configura o clique.
 * @param {string} buttonId
 * @param {HTMLElement} content
 * @param {Function} onClick
 * @param {string} [label] - opcional, para botões com texto
 */
export function setUpButton({ buttonId, content, onClick, label }) {
  const btn = document.getElementById(buttonId);
  toggleButtonVisibility(btn, true);
  setButtonClick(btn, onClick, content, label);
}

/**
 * Remove ou oculta um botão
 * @param {string} buttonId
 */
export function removeButton(buttonId) {
  const btn = document.getElementById(buttonId);
  toggleButtonVisibility(btn, false);
}

/* ================= Funções antigas (compatibilidade) ================= */
export function setUpButtonAdd({ buttonId = "btnAdd", content, onClick }) {
  setUpButton({ buttonId, content, onClick });
}

export function setUpButtonAsign({
  buttonId = "btnAsign",
  content,
  onClick,
  label,
}) {
  setUpButton({ buttonId, content, onClick, label });
}

export function removeAddButton() {
  removeButton("btnAdd");
}

/* ================= Form Helpers ================= */
export function enableEnterNavigation(fields, onLastEnter) {
  fields.forEach((field, index) => {
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = fields[index + 1];
        if (next) next.focus();
        else if (typeof onLastEnter === "function") onLastEnter();
      }
    });
  });
}

/* ================= Normalização ================= */
export function normalize(str) {
  return (
    str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase() || ""
  );
}

export function normalizeUrl(url) {
  return url?.replace(/([^:]\/)\/+/g, "$1") || "";
}

/* ================= Datas ================= */
export function getCurrentDateDDMMYYYY() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

export function formatDateToDDMMYYYY(dateInput) {
  if (!dateInput) return "";
  const d = new Date(dateInput);
  if (isNaN(d)) return "";
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

/* ================= Map / Geolocation ================= */
export function setUpMapButton(filteredTerritories) {
  setUpButton({
    buttonId: "btnMap",
    onClick: () => openMapPage(filteredTerritories),
  });
}

export async function openMapPage(filteredTerritories) {
  const territoriesWithLocation = filteredTerritories
    .filter((t) => t.addresses?.some((a) => a.lat && a.lng))
    .map((t) => ({
      id: t.id,
      number: t.number,
      name: t.name,
      addresses: t.addresses
        .filter((a) => a.lat && a.lng)
        .map((a) => ({ name: a.name, lat: Number(a.lat), lng: Number(a.lng) })),
    }));

  const territoriesWithoutLocation = filteredTerritories.filter(
    (t) => !t.addresses?.some((a) => a.lat && a.lng)
  );

  let userPosition = null;
  try {
    userPosition = await getUserLocation();
  } catch {
    userPosition = null;
  }

  const mapData = {
    withLocation: territoriesWithLocation,
    withoutLocation: territoriesWithoutLocation,
    userPosition,
  };
  const mapWindow = window.open("map.html", "_blank");

  const interval = setInterval(() => {
    if (mapWindow?.postMessage) {
      mapWindow.postMessage({ type: "MAP_DATA", payload: mapData }, "*");
      clearInterval(interval);
    }
  }, 100);
}

export async function getUserLocation() {
  if (navigator.geolocation) {
    try {
      return await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
    } catch {
      console.warn("Falha no navegador. Tentando via IP...");
    }
  }
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Falha ao consultar IP");
    const data = await res.json();
    return { lat: Number(data.latitude), lng: Number(data.longitude) };
  } catch (err) {
    console.warn("Falha ao obter localização via IP:", err);
  }
  return null;
}

/* ================= Helpers de Input ================= */
export function resolveLatLngWithComma(container, selector) {
  const value = container.querySelector(selector)?.value;
  const num = parseFloat(value);
  return isNaN(num) ? "" : num.toString().replace(".", ",");
}
