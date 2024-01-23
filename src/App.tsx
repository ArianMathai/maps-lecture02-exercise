import React, {MutableRefObject, useEffect, useRef} from "react";
import './App.css';
import {Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import {OSM} from "ol/source";
import {useGeographic} from "ol/proj";

useGeographic()

const map = new Map({
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view:
        new View({
            center: [10, 59], zoom: 8
        })
});
function App() {

    const mapRef = useRef() as MutableRefObject<HTMLDivElement>;

    useEffect(() => {
        map.setTarget(mapRef.current)
    }, []);

    return (
        <>
        <header><h1>Map app</h1></header>
        <nav></nav>
            <main>
                <div ref={mapRef} className={"map"}>

                </div>

            </main>
        </>
    )

}

export default App;