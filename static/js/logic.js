let earthquake_link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquake_link).then(function(data){
  let earthquake_map = L.map("map", {
    center: [40, -100],
    zoom: 3
  });

  console.log(data);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(earthquake_map);

  data.features.forEach(function(feature) {
    let latitude = feature.geometry.coordinates[1];
    let longitude = feature.geometry.coordinates[0];
    let magnitude = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];
    let marker = L.circleMarker([latitude, longitude], {
      radius: getRadius(magnitude),
      fillColor: getValue(depth),
      color: "black",
      fillOpacity: 0.9,
      weight: 0.7
    }).addTo(earthquake_map);

    let popupContent = "<strong>Magnitude:</strong> " + magnitude + "<br>" +
      "<strong>Depth:</strong> " + depth + "<br>" + "<strong>Place:</strong> " + feature.properties.place;
    marker.bindPopup(popupContent);
  });

  function getValue(x) {
  return x > 100 ? "#ec6a6a" :
         x > 90 ? "#ec6a6a" :
         x > 70 ? "#efa76a" :
         x > 50 ? "#f2ba4c" :
         x > 30 ? "#f2dc4c" :
         x > 10 ? "#e1f34f" :
                "#b5f44c"};

  let legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let limits = [100, 90, 70, 50, 30, 10, -10]
    let colors = ["#ec6a6a",
                  "#ec6a6a",
                  "#efa76a",
                  "#f2ba4c",
                  "#f2dc4c",
                  "#e1f34f",
                  "#b5f44c"]

    for (let i = 0; i < limits.length; i++) {
      console.log(colors[i]);
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
      }
    return div;
  };

  legend.addTo(earthquake_map);

  function getRadius(magnitude) {
    if (magnitude === 0) {return 1;}
    return magnitude * 4;}
});