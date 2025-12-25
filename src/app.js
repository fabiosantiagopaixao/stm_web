import { navigateTo } from "./route.js";

// expõe globalmente para onclick inline funcionar
window.navigate = navigateTo;

// exemplo de toggle do menu
document.getElementById("menuBtn").onclick = () => {
  document.getElementById("sidebar").classList.toggle("closed");
};

// inicia na home
navigateTo("home");
