import { CoordinateContext } from "@/app/context/coordinateContext";
import { useContext, useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import LineGraph from "./LineGraph/LineGraph";
import AreaGraph from "./AreaGraph/AreaGraph";
import BarGraph from "./BarGraph/BarGraph";
import Histogram from "./Histogram/Histogram";
import ScatterPlot from "./ScatterPlot/ScatterPlot";

const Analytics=()=>{

    const {outputData,activeSection,analysisOptions}=useContext(CoordinateContext);

    const [currentWQI,setCurrentWQI]=useState(56);
    const [previousWQI,setPreviousWQI]=useState(27); 

    return(
        <div className={`${activeSection == 'analysis' ? 'duration-500  w-[80%]' : 'duration-500  w-[40%]'} ${outputData.output=='' && outputData.isLoading==false ? 'hidden w-[0%]' : 'flex w-[40%]'} absolute right-0 top-[95px] overflow-auto menu-bar-scrollbar h-[calc(100vh-97px)] transition-all ease-in-out duration-1000 bg-black flex-col items-center`}>
            {outputData.isLoading && <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}><Loader/></div>}
            {outputData.output!='' &&
                <div className="flex flex-col pb-5 w-full text-white ">
                    <div className={`flex gap-2 ${activeSection=='analysis' ? 'w-1/2 absolute right-4' : 'w-full relative'} `}> 
                        <div className="bg-[#222222] w-1/2 flex flex-col items-center pt-1 h-20">
                            <p className="text-sm font-medium">Water Quality Index (Current)</p>
                            <h1 className={`text-5xl font-bold ${currentWQI < 38 ? 'text-red-600' : currentWQI < 50 ? 'text-orange-500' : currentWQI < 63 ? 'text-yellow-400' : 'text-green-500'}`}>{currentWQI}</h1>
                        </div>
                        <div className="bg-[#222222] w-1/2 flex flex-col items-center h-20 pt-1">
                            <p className="text-sm font-medium">Water Quality Index (Last Month)</p>
                            <h1 className={`text-5xl font-bold ${previousWQI < 38 ? 'text-red-600' : previousWQI < 50 ? 'text-orange-500' : previousWQI < 63 ? 'text-yellow-400' : 'text-green-500'}`}>{previousWQI}</h1>
                        </div>
                    </div>
                    <div className={`mb-2.5 mt-4 ${activeSection=='analysis' ? 'w-1/2 absolute right-4 top-20' : 'w-full relative'} h-1 bg-[#815A0D]`}></div>
                    <div className={`flex flex-col gap-6  ${activeSection=='analysis' ? 'w-fit mt-32' : ''}`}>
                        {(activeSection=='analysis') && 
                            <div>
                                {analysisOptions.graphType=='Bar Graph' && <div id="bar-graph-container" className="bg-[#2C2C2D] text-gray-200">
                                    <BarGraph data={outputData.output} />
                                </div>
                                }
                                {analysisOptions.graphType=='Line Graph' && <div id="line-graph-container" className="bg-[#2C2C2D] text-gray-200">
                                    <LineGraph data={outputData.output}/>
                                </div>
                                }
                                {analysisOptions.graphType=='Area Graph' && <div id="area-graph-container" className="bg-[#2C2C2D] text-gray-200">
                                    <AreaGraph data={outputData.output}/>
                                </div>
                                }
                                {analysisOptions.graphType=='Histogram' && <div id="histogram-container" className="bg-[#2C2C2D] text-gray-200">
                                    <Histogram data={outputData.output}/>
                                </div>
                                }
                                {analysisOptions.graphType=='Scatter Plot' && <div id="scatter-plot-container" className="bg-[#2C2C2D] text-gray-200">
                                    <ScatterPlot data={outputData.output}/>
                                </div>
                                }
                            </div>
                        }
                        {activeSection=='input' &&
                        <div id="bar-graph-container" className="bg-[#2C2C2D] text-gray-200 ">
                            <BarGraph data={outputData.output}/>
                        </div>
                        }
                        {activeSection=='input' &&
                        <div id="line-graph-container" className="bg-[#2C2C2D] text-gray-200 ">
                            <LineGraph data={outputData.output}/>
                        </div>
                        }
                        {activeSection=='input' && 
                        <div id="histogram-container" className="bg-[#2C2C2D] text-gray-200">
                            <Histogram data={outputData.output}/>
                        </div>
                        }
                        {activeSection=='input' && 
                        <div id="area-graph-container" className="bg-[#2C2C2D] text-gray-200">
                            <AreaGraph data={outputData.output}/>
                        </div>
                        }
                        {activeSection=='input' && 
                        <div id="scatter-plot-container" className="bg-[#2C2C2D] text-gray-200">
                            <ScatterPlot data={outputData.output}/>
                        </div>
                        }
                    </div>            
                </div>
            }
        </div>
    );
}

export default Analytics;