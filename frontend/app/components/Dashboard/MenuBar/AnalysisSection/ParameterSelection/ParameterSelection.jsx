import { useContext, useEffect, useRef, useState } from "react";
import { CoordinateContext } from "@/app/context/coordinateContext";

const OptionButton=({label,onClick})=>(
    <button onClick={onClick} className="block px-4 py-1.5 text-[15px] text-gray-500 hover:bg-[#04507C] hover:text-white w-full text-left">{label}</button>
);

const ParameterSelection=()=>{

    const {analysisOptions,setAnalysisOptions}=useContext(CoordinateContext);

    const [isXAxisOpen,setIsXAxisOpen]=useState(false);
    const [isYAxisOpen,setIsYAxisOpen]=useState(false);

    const xAxisDropDownRef=useRef(null);
    const yAxisDropDownRef=useRef(null);

    const handleXAxisSelection=(parameter)=>{

        setAnalysisOptions((prevOptions) => ({
            ...prevOptions,  
            xAxisParameter:parameter
        }));
        
        setIsXAxisOpen(false);

    }

    const handleYAxisSelection=(parameter)=>{

        setAnalysisOptions((prevOptions) => ({
            ...prevOptions,  
            yAxisParameter:parameter
        }));
        
        setIsYAxisOpen(false);

    }

    useEffect(()=>{
    
        const handleClickOutside=(event)=>{

            if (xAxisDropDownRef.current && !xAxisDropDownRef.current.contains(event.target)) {
                setIsXAxisOpen(false);
            }
            if (yAxisDropDownRef.current && !yAxisDropDownRef.current.contains(event.target)) {
                setIsYAxisOpen(false);
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
                <div className="font-medium text-[15px] mb-1">Graph Settings</div>
                <label className="font-medium ml-3 text-[14px]">X-Axis</label>
                <div ref={xAxisDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{setIsXAxisOpen(!isXAxisOpen)}} className={`flex justify-between items-center w-[218px] ml-3 px-4 py-1.5 text-[15px] border text-[#815A0D] border-[#815A0D] font-semibold focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        <div className="truncate mr-2">{analysisOptions.xAxisParameter}</div>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isXAxisOpen && (
                        <div className="absolute mt-0.5 right-0 w-[218px] z-10 origin-top-right bg-white shadow-lg">
                            <div>
                                {analysisOptions.graphType!='Histogram' && <OptionButton label={'Date Range'} onClick={()=>handleXAxisSelection('Date Range')} />}
                                {analysisOptions.parameters.map(parameter=>(
                                    <OptionButton key={parameter} label={parameter} onClick={()=>handleXAxisSelection(parameter)} />                        
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <label className="font-medium ml-3 text-[14px]">Y-Axis</label>
                <div ref={yAxisDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{setIsYAxisOpen(!isYAxisOpen)}} className={`flex justify-between items-center w-[218px] ml-3 px-4 py-1.5 text-[15px] border text-[#815A0D] border-[#815A0D] font-semibold focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        <div className="truncate mr-2">{analysisOptions.graphType=='Histogram' ? 'Frequency' : analysisOptions.yAxisParameter}</div>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isYAxisOpen && (
                        <div className="absolute mt-0.5 right-0 w-[218px] z-10 origin-top-right bg-white shadow-lg">
                            <div>
                                {analysisOptions.graphType!='Histogram' && analysisOptions.parameters.map(parameter=>(
                                    <OptionButton key={parameter} label={parameter} onClick={()=>handleYAxisSelection(parameter)} />                        
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default ParameterSelection;