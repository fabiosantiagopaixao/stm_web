const GOOGLE_MAPS_API_KEY = "AIzaSyDk9AUNcWTeX7NzGRKVf9Mw_p00R4Bblh0";

let mapData = null;
let mapsLoaded = false;

/* =======================
   GOOGLE MAPS LOADER
======================= */
loadGoogleMaps();

/* =======================
   RECEIVE DATA
======================= */
window.addEventListener("message", (event) => {
  if (event.data?.type === "MAP_DATA") {
    mapData = event.data.payload;
    tryInitMap();
  }
});

/* =======================
   LOADER
======================= */
function loadGoogleMaps() {
  if (window.google?.maps) {
    mapsLoaded = true;
    tryInitMap();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    mapsLoaded = true;
    tryInitMap();
  };

  script.onerror = () => {
    console.error("Google Maps failed to load");
  };

  document.head.appendChild(script);
}

/* =======================
   INIT MAP
======================= */
function tryInitMap() {
  if (!mapsLoaded || !mapData) return;
  initMap();
}

function initMap() {
  renderNoLocation();
  renderMap();
}

/* =======================
   UI
======================= */
function renderNoLocation() {
  const noLocDiv = document.getElementById("no-location");

  if (!mapData.withoutLocation?.length) {
    noLocDiv.style.display = "none";
    return;
  }

  noLocDiv.innerHTML = `
    <h3>Territorios sin localización:</h3>
    <ul>
      ${mapData.withoutLocation
        .map((t) => `<li>${t.number} - ${t.name}</li>`)
        .join("")}
    </ul>
  `;
}

/* =======================
   MAP RENDER
======================= */
function renderMap() {
  const mapCenter = mapData.userPosition || { lat: 0, lng: 0 };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: mapCenter,
    zoom: mapData.userPosition ? 12 : 2,
  });

  if (mapData.userPosition) {
    addUserMarker(map);
  }

  addTerritoryMarkers(map);
}

function addUserMarker(map) {
  new google.maps.Marker({
    position: mapData.userPosition,
    map,
    title: "Your location",
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  });
}

function addTerritoryMarkers(map) {
  const bounds = new google.maps.LatLngBounds();

  mapData.withLocation.forEach((territory) => {
    territory.addresses.forEach((address) => {
      const marker = new google.maps.Marker({
        position: { lat: address.lat, lng: address.lng },
        map,
        title: `${territory.number} - ${territory.name} (${address.name})`,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

      bounds.extend(marker.position);

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <b>${territory.number}</b><br>
          ${territory.name}<br>
          ${address.name}
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  });

  if (mapData.withLocation.length) {
    map.fitBounds(bounds);
  }
}
