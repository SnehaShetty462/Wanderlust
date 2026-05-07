const listingCoordinates = listing.geometry.coordinates;

const latlng = [
  listingCoordinates[1],
  listingCoordinates[0]
];

const map = L.map('map').setView(latlng, 13);

L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  }
).addTo(map);

const redIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.marker(latlng, { icon: redIcon })
  .addTo(map)
  .bindPopup(
    `<h4>${listing.title}</h4>
     <p>Exact Location will be provided after bookings</p>`
  );