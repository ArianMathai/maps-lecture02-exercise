import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Layer } from "ol/layer";
import { Map, Feature, MapBrowserEvent } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";
import { Fill, Stroke, Style, Circle } from "ol/style";
import { Point } from "ol/geom";
import { FeatureLike } from "ol/Feature";

type KraftverkProperties = {
  vannkraf_1: string;
  vannkraf_3: string;
};

type KraftverkFeature = {
  getProperties(): KraftverkProperties;
} & Feature<Point>;

function kraftverkStyle() {
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 2 }),
      fill: new Fill({ color: "blue" }),
      radius: 5,
    }),
  });
}

function hoveredKraftverkStyle() {
  return new Style({
    image: new Circle({
      stroke: new Stroke({ color: "white", width: 3 }),
      fill: new Fill({ color: "blue" }),
      radius: 7,
    }),
  });
}

function KraftverkLayerCheckBox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const [checked, setChecked] = useState(false);
  const [hoveredKraftverk, setHoveredKraftverk] = useState<KraftverkFeature>();

  const kraftverkLayer = useMemo(
    () =>
      new VectorLayer({
        className: "kraftverkLayer",
        source: new VectorSource({
          url: "/maps-lecture02-exercise/kraftverk.json",
          format: new GeoJSON(),
        }),
        style: kraftverkStyle,
      }),
    [],
  );

  function handlePointerMove(e: MapBrowserEvent<PointerEvent>) {
    const features: FeatureLike[] = [];
    map.forEachFeatureAtPixel(e.pixel, (f) => features.push(f), {
      hitTolerance: 6,
      layerFilter: (l) => l === kraftverkLayer,
    });
    if (features.length === 1) {
      setHoveredKraftverk(features[0] as KraftverkFeature);
    } else {
      setHoveredKraftverk(undefined);
    }
  }

  useEffect(() => {
    hoveredKraftverk?.setStyle(hoveredKraftverkStyle);
    return () => hoveredKraftverk?.setStyle(undefined);
  }, [hoveredKraftverk]);

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kraftverkLayer]);
      map.on("pointermove", handlePointerMove);
    }
    return () => {
      setLayers((old) => old.filter((old) => old != kraftverkLayer));
      map.un("pointermove", handlePointerMove);
    };
  }, [checked]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {!checked ? "Vis" : "Skjul"} kraftverk
      </label>
    </div>
  );
}
export default KraftverkLayerCheckBox;
