import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";

const initialCenter = [139.766966, 35.681163];
const initailZoom = 13;
const map = new maplibregl.Map({
  container: "map",
  zoom: initailZoom,
  hash: true,
  center: initialCenter,
  minZoom: 5,
  maxZoom: 14,
  style: "styles/style.json",
});

window.map = map;

const protocol = new Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

map.on("load", async () => {
  map.addControl(new maplibregl.NavigationControl());
  // map.showTileBoundaries = true;
  map.on("move", () => {
    const center = map.getCenter();
    document.getElementById("fly").value =
      center.lat.toFixed(6) +
      ", " +
      center.lng.toFixed(6) +
      ", " +
      map.getZoom().toFixed(2);
  });

  // アイコン読み込み
  const image = await map.loadImage("icons/square.png");
  if (!map.hasImage("square")) {
    map.addImage("square", image.data, {
      content: [2, 2, 14, 14],
      stretchX: [[2, 14]],
      stretchY: [[2, 14]],
    });
  }
});

document.getElementById("fly").value =
  initialCenter[1] + ", " + initialCenter[0] + ", " + initailZoom;

document.getElementById("fly").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    var coords = document.getElementById("fly").value;
    var pattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?,\s\d+(\.\d+)?$/;
    if (pattern.test(coords)) {
      var splittedCoods = coords.split(",");
      map.jumpTo({
        center: [parseFloat(splittedCoods[1]), parseFloat(splittedCoods[0])],
        zoom: parseFloat(splittedCoods[2]),
      });
    }
  }
});
