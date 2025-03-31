"use client"
import { createContext, useState } from "react";

export const CoordinateContext=createContext(null);

const CoordinateContextProvider=({children})=>{

    const [activeSection,setActiveSection]=useState('input');

    const [coordinateData,setCoordinateData]=useState({
        coordinate:'',
        type:'',
        waterBodyName:'',
    });
    
    const [outputData,setOutputData]=useState({
        isLoading:false,
        output:'',
    });

    const [dateRange,setDateRange]=useState({
        startDate:'',
        endDate:'',
    });

    const [parameters,setParameters]=useState([]);

    const [analysisOptions,setAnalysisOptions]=useState({
        parameters:[],
        graphType:'Bar Graph',
        xAxisParameter:'Date Range',
        yAxisParameter:'',
        startDate:'',
        endDate:'',
    })
    
    return(
        <CoordinateContext.Provider value={{activeSection,setActiveSection,coordinateData,setCoordinateData,outputData,setOutputData,dateRange,setDateRange,parameters,setParameters,analysisOptions,setAnalysisOptions}}>
            {children}
        </CoordinateContext.Provider>
    );

};

export default CoordinateContextProvider;

