import { navigateTo } from "./route.js";

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");
const iconLogout = document.getElementById("iconLogout");

// Botão ☰
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  iconLogout.classList.add("margLeft10");
});

// Links do menu
document.querySelectorAll("#sidebar .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const page = link.dataset.page;
    navigateTo(page);

    // 👉 Fecha automaticamente em telas pequenas
    if (window.innerWidth < 992) {
      sidebar.classList.add("collapsed");
    }
  });
});


// Home padrão
navigateTo("home");
