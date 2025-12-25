import { navigateTo } from "./route.js";

window.navigate = navigateTo;

// Carrega a home por padrão
navigateTo("home");
