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

export function removeAddButton() {
  const btnAdd = document.getElementById("btnAdd");
  if (!btnAdd) return;

  btnAdd.classList.add("noneButton");
}

export function setUpButtonAdd({ buttonId = "btnAdd", content, onClick }) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.classList.remove("noneButton");

  btn.onclick = (e) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(content);
    }
  };
}

export function setUpButtonAsign({
  buttonId = "btnAsign",
  content,
  onClick,
  label,
}) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.classList.remove("noneButton");
  btn.textContent = label;

  btn.onclick = (e) => {
    e.preventDefault();
    if (typeof onClick === "function") {
      onClick(content);
    }
  };
}

/**
 * Permite navegar pelos inputs de um formulário usando Enter.
 * @param {HTMLElement[]} fields - Array de inputs/selects do formulário, na ordem.
 * @param {Function} onLastEnter - Função a ser executada quando o usuário apertar Enter no último campo.
 */
export function enableEnterNavigation(fields, onLastEnter) {
  fields.forEach((field, index) => {
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();

        const nextField = fields[index + 1];
        if (nextField) {
          nextField.focus();
        } else if (typeof onLastEnter === "function") {
          onLastEnter(); // dispara a ação no último input
        }
      }
    });
  });
}

export function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function normalizeUrl(url) {
  return url.replace(/([^:]\/)\/+/g, "$1");
}

export function getCurrentDateDDMMYYYY() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // mês começa em 0
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatDateToDDMMYYYY(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/* ===== MAP BUTTON ===== */
export function setUpMapButton(filteredTerritories) {
  const btnMap = document.getElementById("btnMap");
  if (!btnMap) return;

  btnMap.classList.remove("noneButton");

  btnMap.onclick = async () => {
    try {
      await openMapPage(filteredTerritories);
    } catch (e) {
      console.error("Error opening map:", e);
      alert("Could not open map.");
    }
  };
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

  // Abre a página em branco
  const mapWindow = window.open("map.html", "_blank");

  // Quando a página estiver carregada, envia os dados
  const interval = setInterval(() => {
    if (mapWindow && mapWindow.postMessage) {
      mapWindow.postMessage({ type: "MAP_DATA", payload: mapData }, "*");
      clearInterval(interval);
    }
  }, 100);
}

/**
 * Tenta obter a localização do usuário.
 * 1. Usa o navegador (navigator.geolocation) se permitido.
 * 2. Se negado ou não suportado, tenta fallback via IP (aproximado).
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export async function getUserLocation() {
  // Tenta via navegador
  if (navigator.geolocation) {
    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          reject,
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });
      return pos;
    } catch (err) {
      console.warn("Falha ao obter localização via navegador:", err);
      alert(
        "Não foi possível obter sua localização pelo navegador. Tentando localização aproximada via IP..."
      );
    }
  } else {
    console.warn("Geolocalização não suportada no navegador.");
  }

  // Fallback usando IP (aproximado)
  try {
    const res = await fetch("https://ipapi.co/json/"); // serviço gratuito de geolocalização por IP
    if (!res.ok) throw new Error("Falha ao consultar IP");
    const data = await res.json();
    return { lat: Number(data.latitude), lng: Number(data.longitude) };
  } catch (err) {
    console.warn("Falha ao obter localização via IP:", err);
  }

  // Se tudo falhar, retorna null
  return null;
}

export function resolveLatLngWithComma(container, selector) {
  const value = container.querySelector(selector)?.value;
  if (!value) return ""; // se não houver dado, retorna vazio

  // Converte para float
  const num = parseFloat(value);
  if (isNaN(num)) return ""; // se não for número válido, retorna vazio

  // Converte para string e substitui ponto por vírgula
  return num.toString().replace(".", ",");
}
