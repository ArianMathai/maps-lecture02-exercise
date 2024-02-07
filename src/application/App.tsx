import React, {
  MutableRefObject,
  useContext,
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
import KommuneAside from "../kommune/KommuneAside";
import { map, MapContext } from "../context/MapContext";

useGeographic();

function App() {
  const [checked, setChecked] = useState(false);
  function handleFocusOnMe(e: React.MouseEvent) {
    e.preventDefault();

    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos.coords);
      const { latitude, longitude } = pos.coords;
      map.getView().animate({
        center: [longitude, latitude],
        zoom: 19,
      });
    });
  }

  const [layers, setLayers] = useState<Layer[]>([
    new TileLayer({
      source: new OSM(),
    }),
  ]);
  /*
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
  
 */

  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    map.setLayers(layers);
  }, [layers]);

  useEffect(() => {
    map.setTarget(mapRef.current);
  }, []);

  return (
    <>
      <MapContext.Provider value={{ map, checked, setChecked, layers }}>
        <header>
          <h1>Map app</h1>
        </header>
        <nav>
          <KommuneLayerCheckBox setLayers={setLayers} map={map} />
          <a href="#" onClick={handleFocusOnMe}>
            Focus on my location
          </a>
        </nav>
        <main>
          <div ref={mapRef} className={"map"}></div>
          <KommuneAside />
        </main>
      </MapContext.Provider>
    </>
  );
}

export default App;
