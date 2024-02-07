import React, { useContext, useEffect, useMemo, useState } from "react";
import { MapContext } from "../context/MapContext";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol/render/webgl/MixedGeometryBatch";
import { Map, MapBrowserEvent } from "ol";
import { Fill, Stroke, Style } from "ol/style";
import { StyleLike } from "ol/style/Style";

type Stedsnavn = {
  sprak: string;
  navn: string;
};
type KommuneProperties = {
  navn: Stedsnavn[];
};
interface KommuneFeature extends Feature {
  getProperties(): KommuneProperties;
}

type KommuneVectorLayer = VectorLayer<VectorSource<KommuneFeature>>;

function getStedsnavn(navn: Stedsnavn[]) {
  return navn.find((n) => n.sprak === "nor")?.navn;
}

function useKommuneFeatures() {
  const { map, layers } = useContext(MapContext);
  const kommuneLayer = layers.find(
    (l) => l.getClassName() === "kommuneLayer",
  ) as KommuneVectorLayer;
  const [features, setFeatures] = useState<KommuneFeature[]>();

  const [viewExtent, setViewExtent] = useState(
    map.getView().getViewStateAndExtent().extent,
  );

  const visibleFeatures = useMemo(
    () =>
      features?.filter((f) => f.getGeometry()?.intersectsExtent(viewExtent)),
    [features, viewExtent],
  );

  function handleChangeViewExtent() {
    setViewExtent(map.getView().getViewStateAndExtent().extent);
  }
  function handleSetFeatures() {
    setFeatures(kommuneLayer?.getSource()?.getFeatures());
  }

  useEffect(() => {
    map.getView().on("change", handleChangeViewExtent);
    return () => {
      map.getView().un("change", handleChangeViewExtent);
    };
  }, [map]);

  useEffect(() => {
    kommuneLayer?.getSource()?.on("change", handleSetFeatures);
    handleSetFeatures();
    /*
    return () => {
      kommuneLayer?.getSource()?.un("change", handleSetFeatures);
    };

     */
  }, [kommuneLayer]);

  return { kommuneLayer, features, visibleFeatures };
}

//const kommuneLayer = layers.find((l) => l.getClassName() === "kommuneLayer");
//const features = (kommuneLayer?.getSource() as VectorSource)?.getFeatures();
function KommuneAside() {
  const { features, visibleFeatures, kommuneLayer } = useKommuneFeatures();

  const { map } = useContext(MapContext);

  const [hoveredKommune, setHoveredKommune] = useState<KommuneFeature>();

  function handleHoveredKommune(e: MapBrowserEvent<MouseEvent>) {
    const features = kommuneLayer
      .getSource()
      ?.getFeaturesAtCoordinate(e.coordinate);
    console.log("features", features);
    setHoveredKommune(
      features?.length === 1 ? (features[0] as KommuneFeature) : undefined,
    );
    hoveredKommune?.setStyle(
      new Style({
        stroke: new Stroke({
          color: "red",
          width: 2,
        }),
      }),
    );

    if (!features?.includes(hoveredKommune as Feature)) {
      hoveredKommune?.setStyle(undefined);
    }
  }
  /*
  useEffect(() => {
    if (hoveredKommune !== undefined) {
      hoveredKommune.setStyle(
        new Style({
          fill: new Fill({
            color: "#eeeeee",
          }),
        }),
      );
    }
  }, [hoveredKommune]);
  
 */

  useEffect(() => {
    if (visibleFeatures) {
      map.on("pointermove", handleHoveredKommune);
    }
    return () => {
      map.un("pointermove", handleHoveredKommune);
    };
  }, [visibleFeatures, map]);

  return (
    <>
      <aside className={features?.length ? "visible" : "hidden"}>
        <div>
          <h3>Kommuner</h3>
          <ul>
            {visibleFeatures?.map((k) => (
              <li
                className={
                  getStedsnavn(k.getProperties().navn) ===
                  hoveredKommune?.getProperties().navn[0].navn
                    ? "makeBold"
                    : ""
                }
              >
                {getStedsnavn(k.getProperties().navn)}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
export default KommuneAside;
