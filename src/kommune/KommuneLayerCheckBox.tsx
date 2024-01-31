import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Map, MapBrowserEvent, Overlay } from "ol";
import { Layer } from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { GeoJSON } from "ol/format";

type NavnMedSprak = {
  sprak: "nor" | "sme" | "sma" | "smj" | "fkv";
  navn: string;
  rekkefolge: string;
};

type KommuneProperties = {
  navn: NavnMedSprak[];
  objtype: "Kommune";
  samiskforvaltningomrade: boolean;
  kommunenummer: string;
};

type JohannesKommuneProperties = {
  navn: {
    nor: string;
    sme?: string;
    fkv?: string;
  };
};

function KommuneLayerCheckBox({
  setLayers,
  map,
}: {
  setLayers: Dispatch<SetStateAction<Layer[]>>;
  map: Map;
}) {
  const [clickedKommuneNavn, setClickedKommuneNavn] = useState<
    string | undefined
  >();

  function handleClick(e: MapBrowserEvent<MouseEvent>) {
    const features = map.getFeaturesAtPixel(e.pixel);
    console.log(features);

    if (features.length === 1) {
      const kommune = features[0].getProperties() as KommuneProperties;
      setClickedKommuneNavn(kommune.navn.find((n) => "nor")!.navn);
    } else {
      setClickedKommuneNavn(undefined);
    }
  }

  const [checked, setChecked] = useState(false);

  const kommuneLayer = useMemo(
    () =>
      new VectorLayer({
        source: new VectorSource({
          url: "/maps-lecture02-exercise/kommuner.json",
          format: new GeoJSON(),
        }),
      }),
    [],
  );

  useEffect(() => {
    if (checked) {
      setLayers((old) => [...old, kommuneLayer]);
      map.on("click", handleClick);
    }
    return () => {
      setClickedKommuneNavn("");
      setLayers((old) => old.filter((old) => old != kommuneLayer));
      map.un("click", handleClick);
    };
  }, [checked]);

  const overlay = useMemo(() => new Overlay({}), []);
  const overlayRef = useRef() as MutableRefObject<HTMLDivElement>;

  const dialogRef = useRef() as MutableRefObject<HTMLDialogElement>;

  useEffect(() => {
    if (clickedKommuneNavn) {
      dialogRef.current.showModal();
    }
  }, [clickedKommuneNavn]);

  useEffect(() => {
    console.log("inside add overlay");
    overlay.setElement(overlayRef.current);
    map.addOverlay(overlay);
    return () => {
      map.removeOverlay(overlay);
    };
  }, []);

  useEffect(() => {
    console.log(clickedKommuneNavn);
  }, [clickedKommuneNavn]);

  function handleDialogClick(e: React.MouseEvent) {
    const boundingRect = (e.target as HTMLElement).getBoundingClientRect();
    if (
      boundingRect.top < e.clientY &&
      e.clientY < boundingRect.bottom &&
      boundingRect.left < e.clientX &&
      e.clientX < boundingRect.right
    ) {
      console.log("inside");
    } else {
      console.log("oustide");
      dialogRef.current.close();
      setClickedKommuneNavn(undefined);
    }
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {!checked ? "Vis" : "Skjul"} kommuner
      </label>

      <div ref={overlayRef}>
        <dialog
          className={"kommuneinfo"}
          ref={dialogRef}
          onClick={handleDialogClick}
        >
          <p>{clickedKommuneNavn}</p>
          <form method={"dialog"}>
            <button
              onClick={() => {
                dialogRef.current.close();
                setClickedKommuneNavn(undefined);
              }}
            >
              Lukk
            </button>
          </form>
        </dialog>
      </div>
    </div>
  );
}

export default KommuneLayerCheckBox;
