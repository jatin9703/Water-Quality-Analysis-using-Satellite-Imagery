import { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"; 
import { CoordinateContext } from "@/app/context/coordinateContext";
import config from "@/config";
import axios from "axios";
import Loader from "../../Loader/Loader";
import { toast, Toaster } from "sonner";

const Map = () => {
    
    const {activeSection,coordinateData,setCoordinateData,outputData}=useContext(CoordinateContext);
    
    const mapContainer = useRef(null);
    const map = useRef(null);
  
    const observer = useRef(null);
    const [isShrink,setIsShrink]=useState(false);

    const draw = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const isLandFoundRef = useRef(false); // Using a ref to track isLandFound
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading,setIsLoading]=useState(false);

    const [drawnCoordinates,setDrawnCoordinates]=useState('');
    const [isPopUpOpen,setIsPopUpOpen]=useState(false);
    
    const [isFileNamePopUp,setIsFileNamePopUp]=useState(false);
    const [fileName, setFileName] = useState("");
    
    
    useEffect(() => {
        
        mapboxgl.accessToken = config.mapbox_api;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/satellite-streets-v9",
            center: [80.9629, 23.5937],
            zoom: 4,
        });

        map.current.on('style.load', () => {

            // map.current.addSource('gee-tiles', {
            //     type: 'raster',
            //     tiles: [
            //       'https://earthengine.googleapis.com/v1/projects/earthengine-legacy/maps/e5109790f5500d64c92efd8e6e5435f7-827313e3bff18ef96360a1212fcd2e68/tiles/10/512/341' // Replace with your own tile URL
            //     ],
            //     tileSize: 256 // Standard tile size
            //   });
            
            //   map.current.addLayer({
            //     id: 'gee-layer',
            //     type: 'raster',
            //     source: 'gee-tiles',
            //     paint: {}
            //   });
            
            // Add India's border SOURCE
            map.current.addSource('india-border', {
                type: 'geojson',
                data: 'https://geodata.ucdavis.edu/gadm/gadm4.1/json/gadm41_IND_0.json',
            });
        
            // Wait for source to load before adding the layer
            map.current.on('sourcedata', (e) => {
                if (e.sourceId === 'india-border' && e.isSourceLoaded) {
                    // Check if layer already exists
                    if (!map.current.getLayer('india-border')) {
                        map.current.addLayer({
                            id: 'india-border',
                            type: 'line',
                            source: 'india-border',
                            paint: {
                                'line-color': '#4F4D49',
                                'line-width': 3,
                            },
                        });
                    }
                }
            });

        });
         
        draw.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                trash: true,
            },
        });
        
        map.current.addControl(draw.current);

        map.current.on("draw.create", (e) => {
            const coordinates = e.features[0].geometry.coordinates;
            console.log("Shape coordinates: ", coordinates);
            const coordsString = JSON.stringify(coordinates);
            navigator.clipboard
                .writeText(coordsString)
                .then(() => waterCoordinateCheck(coordinates,coordsString))
                .catch((err) => console.error("Failed to copy:", err));
        });
        
        return () => {
            map.current.remove();
        };

    },[]);

    useEffect(() => {
        
        const flyToNewCoordinates=()=>{

            if (map.current && coordinateData?.coordinate){
                
                let zoomLevel = 4;
                
                switch (coordinateData.type){

                    case "state":
                        zoomLevel = 6;
                        break;

                    case "state-district":
                        zoomLevel = 8;
                        break;

                    case "state-district-reservoir":
                    case "drawnPolygon":
                    case "polygon":
                        const polygonCoordinates = coordinateData.coordinate;
                        let bounds = new mapboxgl.LngLatBounds();
                        polygonCoordinates.forEach(coord => {
                            bounds.extend(coord);
                        });

                        map.current.fitBounds(bounds, {
                            padding: 50,
                            duration: 3000,
                            maxZoom: 13,
                        });

                        const polygonFeature = {
                            type: "Feature",
                            geometry: {
                                type: "Polygon",
                                coordinates: [polygonCoordinates],
                            },
                        };

                        draw.current.deleteAll();
                        draw.current.add(polygonFeature);

                        return;
                        
                    default:
                        break;
                }

                // Fly to new coordinates with zoom level

                map.current.flyTo({
                    center: coordinateData.coordinate,
                    zoom: zoomLevel,
                    speed: 1,
                });
            }
        };

        flyToNewCoordinates();
    
    },[coordinateData]);

    const handleDrawButtonClick=()=>{

        if (isDrawing){
            draw.current.changeMode("simple_select");
            setIsDrawing(false);
        }
        else{
            draw.current.deleteAll();
            setCoordinateData({
                type:'',
                coordinate:'',
            });
            draw.current.changeMode("draw_polygon");
            setIsDrawing(true);
        }

    };

    const waterCoordinateCheck=(coordinates,coordsString)=>{
        
        isLandFoundRef.current = false;

        const checkWater = async (longitude, latitude) => {
            console.log(longitude,latitude);
            const options = {
                method: 'GET',
                url: 'https://isitwater-com.p.rapidapi.com/',
                params: {
                    latitude: latitude,
                    longitude: longitude,
                },
                headers: {
                    'x-rapidapi-key': config.rapid_api_02,
                    'x-rapidapi-host': 'isitwater-com.p.rapidapi.com'
                }
            };
    
            try {
                const response = await axios.request(options);
                console.log(response.data.water);
                if (response.data.water==false) {
                    isLandFoundRef.current = true; // Update the ref value
                    toast.error('Land body found in Polygon !! Draw again',{
                        position:'top-center'
                    });
                    toast.dismiss();
                    draw.current.deleteAll();
                    return true;
                }
                return false;
            } 
            catch (error) {
                console.log(error);
                return false;
            }
        };

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const processCoordinates = async () => {
            console.log(coordinates);
    
            let i = currentIndex;
            while (i < coordinates[0].length-1) {
                const [latitude, longitude] = coordinates[0][i];
                setIsLoading(true);
                const stopRequest = await checkWater(latitude, longitude);
                if (stopRequest){ 
                    break;
                } // Stop if water is found
                setCurrentIndex(i + 1);  // Increment index to check the next coordinate
                i++;
    
                // Adding 1-second delay between requests
                await sleep(1000); // 1000ms = 1 second
            }

            setIsLoading(false);
            setIsDrawing(false);

            if (!isLandFoundRef.current) {
                handleDrawnCoordinates(coordsString);
            }

        };

        processCoordinates();

    }

    const handleDrawnCoordinates=(coordinates)=>{
        setDrawnCoordinates(coordinates);
        setIsPopUpOpen(true);
        setIsDrawing(false);
    }
    
    useEffect(()=>{
        
        if (mapContainer.current){
            observer.current = new ResizeObserver(()=>{
                const updateMapSize=()=>{
                    if (map.current){
                        map.current.resize();
                        requestAnimationFrame(updateMapSize); // Keep resizing smoothly
                    }
                };
                requestAnimationFrame(updateMapSize);
            });
            observer.current.observe(mapContainer.current);
        }
        
        return()=>{
            if(observer.current){
                observer.current.disconnect();
            }
        };
    
    },[]);

    useEffect(()=>{
        
        if(!isShrink && outputData.isLoading){
        
            const currentCenter = map.current.getCenter();
        
            map.current.flyTo({
                center: [currentCenter.lng + 0.05, currentCenter.lat],
                zoom: map.current.getZoom() - 0.8,
                speed: 0.3,                       
            });

            setIsShrink(true);
        }
    },[outputData.isLoading]);
    
    const formatCoordinates=(input)=>{
        
        try{
            const parsed = JSON.parse(input);

            // Check if it's a valid array with the expected structure
            if(Array.isArray(parsed) && Array.isArray(parsed[0])){
                return parsed; // Return the valid array of coordinates
            }
            else{
                console.error('Invalid coordinates format');
                return null;
            }
        }
        catch(error){
            console.error('Failed to parse coordinates', error);
            return null;
        }

    };

    const handleSubmit=(fileName)=>{

        const formattedCoordinates=formatCoordinates(drawnCoordinates);

        if(formattedCoordinates){
            const flattenedCoordinates = formattedCoordinates.flat();

            setCoordinateData({
                type:'drawnPolygon',
                coordinate:flattenedCoordinates,
                waterBodyName:fileName,
            });
        }

        setIsPopUpOpen(false);
    
    }

    const handleFileSave = () => {

        if (fileName !== '') {

            const fileContent = drawnCoordinates;
            const blob = new Blob([fileContent], { type: "text/plain" });
    
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${fileName}.txt`; // Append .txt extension
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
    
            setIsFileNamePopUp(false);
            handleSubmit(fileName); // Pass fileName as an argument
        
        }
    };
    

    const handleSaveAndSubmit=()=>{

        if(!drawnCoordinates){
            console.error("No coordinates to save.");
            return;
        }

        setIsPopUpOpen(false);
        setIsFileNamePopUp(true);    
    
    };

    useEffect(() => {
        if (isPopUpOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isPopUpOpen]);


    return (
        <div className={` ${activeSection == 'analysis' ? 'opacity-0 pointer-events-none duration-500' : 'opacity-100 pointer-events-auto duration-500'} ${outputData.output == "" && outputData.isLoading === false ? 'w-[80.5%]' : 'w-[40%]'}  h-full transition-all ease-in-out duration-1000 relative bg-[#212121]`}>
            <div ref={mapContainer} className="w-full h-full"></div>
            {isLoading && <div className="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex justify-center items-center"><Loader/></div>}
            <button onClick={handleDrawButtonClick} className="absolute top-3.5 right-3 border border-gray-700 bg-[#04507C] hover:bg-[#00265C] transition-all duration-300 px-3 py-2.5 shadow shadow-gray-500 rounded-lg text-white">
                {!isDrawing ? (coordinateData.type === 'drawnPolygon' ? "Draw New" : "Draw Polygon") : "Stop Drawing"}
            </button>
            {isPopUpOpen && (
                <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
                <div className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl"></div>
                    <div className={`absolute border border-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out px-10 pt-5 py-6 gap-4 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                        <svg onClick={()=>{setIsPopUpOpen(!isPopUpOpen);draw.current.deleteAll();}} xmlns="http://www.w3.org/2000/svg" className="absolute top-1.5 right-1.5 w-6 h-6 text-gray-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <div className="text-[18px] mt-2 text-white font-medium">Drawn Coordinates</div>
                        <div className="relative w-[450px] pl-2 pt-2 h-72 overflow-auto text-[15px] bg-white text-black">{drawnCoordinates}</div>
                        <div className="flex w-full justify-center gap-10">
                            <button onClick={handleSubmit} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-green-700 ease-in-out px-8 font-semibold text-[15px] bg-green-500 text-white`}>SUBMIT</button>
                            <button onClick={handleSaveAndSubmit} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-blue-800 ease-in-out px-8 font-semibold text-[15px] bg-blue-600 text-white`}>SAVE & SUBMIT</button>
                        </div>
                    </div>
                </div>
            )}
            {isFileNamePopUp && (
                <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
                    <div className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl"></div>
                    <div className={`absolute border border-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out px-10 pt-5 pb-6 gap-4 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                        <div className="text-[18px] text-white">Enter name of the file</div>
                        <div className="flex">
                            <input type="text" onChange={(e)=>setFileName(e.target.value)} value={fileName} className="w-64 border-r-0" placeholder="eg. Gangapur dam"></input>
                            <button onClick={handleFileSave} type="submit" className={`transition-all duration-300 ease-in-out px-8 font-semibold ${fileName=='' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100 hover:bg-blue-800'} text-[15px] bg-blue-600 border border-l-0 border-gray-500 text-white`}>SAVE</button>
                        </div>
                    </div>
                </div>
            )}
            <Toaster richColors/>
        </div>
    );
    
};

export default Map;