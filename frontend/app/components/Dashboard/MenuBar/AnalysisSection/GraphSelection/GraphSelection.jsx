import { useContext, useEffect, useRef, useState } from "react";
import { CoordinateContext } from "@/app/context/coordinateContext";

const OptionButton=({label,onClick})=>(
    <button onClick={onClick} className="block px-4 py-1.5 text-[15px] text-gray-500 hover:bg-[#04507C] hover:text-white w-full text-left">{label}</button>
);

const GraphSelection=()=>{

    const {analysisOptions,setAnalysisOptions}=useContext(CoordinateContext);

    const [isGraphTypeOpen,setIsGraphTypeOpen]=useState(false);

    const graphTypeDropDownRef=useRef(null);

    const handleGraphTypeSelection=(graphType)=>{

        setAnalysisOptions((prevOptions) => ({
            ...prevOptions,  
            graphType:graphType,
        }));
        
        setIsGraphTypeOpen(false);

    }

    useEffect(()=>{
    
        const handleClickOutside=(event)=>{

            if (graphTypeDropDownRef.current && !graphTypeDropDownRef.current.contains(event.target)) {
                setIsGraphTypeOpen(false);
            }

        };
        
        document.addEventListener("mousedown", handleClickOutside);

        return()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    return(
        <div className="flex flex-col gap-3 text-white">
            <div className="flex flex-col gap-1.5">
                <label className="font-medium text-[15px]">Graph Type</label>
                <div ref={graphTypeDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{setIsGraphTypeOpen(!isGraphTypeOpen)}} className={`flex justify-between items-center w-[230px] px-4 py-1.5 text-[15px] border text-[#815A0D] border-[#815A0D] font-semibold focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        {analysisOptions.graphType}
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isGraphTypeOpen && (
                        <div className="absolute mt-0.5 right-0 w-[230px] z-10 origin-top-right bg-white shadow-lg">
                            <div>
                                <OptionButton label={'Line Graph'} onClick={()=>handleGraphTypeSelection('Line Graph')} />
                                <OptionButton label={'Bar Graph'} onClick={()=>handleGraphTypeSelection('Bar Graph')} />                        
                                <OptionButton label={'Area Graph'} onClick={()=>handleGraphTypeSelection('Area Graph')} />                        
                                <OptionButton label={'Histogram'} onClick={()=>handleGraphTypeSelection('Histogram')} />                        
                                <OptionButton label={'Scatter Plot'} onClick={()=>handleGraphTypeSelection('Scatter Plot')} />                                                
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default GraphSelection;