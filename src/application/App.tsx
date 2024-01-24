import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import KommuneLayerCheckBox from "../kommune/KommuneLayerCheckBox";
import { Layer } from "ol/layer";

useGeographic();

function App() {
  function handleFocusOnMe(e: React.MouseEvent) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos.coords);
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 12,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({
      source: new OSM(),
    }),
  ]);

  const map = useMemo(
    () =>
      new Map({
        view: new View({
          center: [10, 59],
          zoom: 8,
        }),
      }),
    [],
  );

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return (
    <>
      <header>
        <h1>Map app</h1>
      </header>
      <nav>
        <KommuneLayerCheckBox setLayers={setLayers} map={map} />
        <a href="#" onClick={handleFocusOnMe}>
          Focus on my location
        </a>
      </nav>
      <main ref={mapRef} className={"map"}></main>
    </>
  );
}

export default App;
