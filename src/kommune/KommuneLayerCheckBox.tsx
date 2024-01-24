import React, {Dispatch, MutableRefObject, SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import {Map, MapBrowserEvent} from "ol";
import {Layer} from "ol/layer";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {GeoJSON} from "ol/format";

function KommuneLayerCheckBox({setLayers, map} : {
    setLayers: Dispatch<SetStateAction<Layer[]>>;
    map: Map;
}) {
    const [clickedKommuneNavn, setClickedKommuneNavn] = useState("")

    function handleClick(e: MapBrowserEvent<MouseEvent>){
        const features = map.getFeaturesAtPixel(e.pixel);
        console.log(features)

        if (features){
            // @ts-ignore
            setClickedKommuneNavn(features[0].values_.navn[0].navn)
        }
    }

    const [checked, setChecked] = useState(false);

    const kommuneLayer = useMemo(() => new VectorLayer({ source: new VectorSource({
        url: "/maps-lecture02-exercise/kommuner.json",
        format: new GeoJSON()
    })}), [])


    useEffect(() => {
        if(checked){
            setLayers(old => [...old, kommuneLayer]);
            map.on("click", handleClick);
        }
        return () => {
            setClickedKommuneNavn("");
            setLayers((old) => old.filter(old => old != kommuneLayer));
            map.un("click",handleClick)
        }
    }, [checked]);

    const kommuneRef = useRef() as MutableRefObject<HTMLDialogElement>

    useEffect(() => {
        if (clickedKommuneNavn){
            kommuneRef.current.showModal();
        }
    }, [clickedKommuneNavn]);

    useEffect(() => {
        console.log(clickedKommuneNavn)
    }, [clickedKommuneNavn]);

    return (
        <div>
            <label>
                <input type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}/>
                {!checked ? "Vis" : "Skjul"} kommuner
            </label>
            <dialog className={"kommuneinfo"} ref={kommuneRef}>
                <p>{clickedKommuneNavn}</p>
                <form method={"dialog"}>
                    <button>Lukk</button>
                </form>
            </dialog>
        </div>
    );
}

export default KommuneLayerCheckBox;