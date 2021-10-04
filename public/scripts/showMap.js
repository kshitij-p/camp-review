mapboxgl.accessToken = accessToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: camp.coordinates, // starting position [lng, lat]
zoom: 9, // starting zoom,
dragRotate: false,
maxBounds: [[-180, -65], [180, 85]]
});

new mapboxgl.Marker().setLngLat(camp.coordinates).addTo(map);
map.addControl(new mapboxgl.NavigationControl({}))