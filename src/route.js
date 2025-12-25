import { loadHome } from "./pages/home.js";
import { loadCongregation } from "./pages/congregation.js";
import { loadUser } from "./pages/user.js";
import { loadTerritory } from "./pages/territory.js";
import { loadAddress } from "./pages/address.js";

export function navigateTo(page) {
  if (page === undefined) return
  
  const routes = {
    home: loadHome,
    congregation: loadCongregation,
    user: loadUser,
    territory: loadTerritory,
    address: loadAddress,
  };

  routes[page]?.();
}
