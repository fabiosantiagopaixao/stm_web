import { navigateTo } from "./route.js";

const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleSidebar");

// Botão ☰
toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
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
