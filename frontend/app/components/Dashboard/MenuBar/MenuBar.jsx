import { useContext, useEffect, useState } from "react";
import CustomCoordinate from "./InputSection/CustomCoordinate/CustomCoordinate";
import InputDateRange from "./InputSection/DateRange/DateRange";
import AnalysisDateRange from "./AnalysisSection/DateRange/DateRange";
import ReservoirSelection from "./InputSection/ReservoirSelection/ReservoirSelection";
import { CoordinateContext } from "@/app/context/coordinateContext";
import axios from "axios";
import InputParameterSelection from "./InputSection/ParameterSelection/ParameterSelection";
import GraphSelection from "./AnalysisSection/GraphSelection/GraphSelection";
import AnalysisParameterSelection from "./AnalysisSection/ParameterSelection/ParameterSelection";
import response from "../../../../sampleOutputData.json";
import config from "@/config";
import Loader from "../../Loader/Loader";

const MenuBar=()=>{

    const {activeSection,setActiveSection,coordinateData,outputData,setOutputData,dateRange,parameters,analysisOptions,setAnalysisOptions}=useContext(CoordinateContext);

    const [isReportLoading,setIsReportLoading]=useState(false);

    const handleSubmit=async()=>{

        if((coordinateData.type === 'polygon' || coordinateData.type === 'state-district-reservoir' || coordinateData.type === 'drawnPolygon') && dateRange.startDate !== '' && dateRange.endDate !== '' && parameters.length !==0){            
            
            const inputData={
                coordinates:coordinateData.coordinate,
                startDate:dateRange.startDate,
                endDate:dateRange.endDate,
                waterParameter:parameters,
            }

            if(coordinateData.waterBodyName!=''){
                inputData.waterBodyName = coordinateData.waterBodyName;
            }

            console.log(inputData);

            setOutputData({
                isLoading:true,
                output:''
            });

            const updatedOutputParameters = parameters.map(param => {
                switch (param) {
                    case 'TEMP':
                        return 'Temperature';
                    case 'PH':
                        return 'pH';
                    case 'COD':
                        return 'Chemical Oxygen Demand (COD)';
                    case 'BOD':
                        return 'Biological Oxygen Demand (BOD)';
                    case 'DO':
                        return 'Dissolved Oxygen (DO)';
                    case 'FC':
                        return 'Fecal Coliform (FC)';
                    default:
                        return param; // Default to original if no match
                }
            });
                        
            setAnalysisOptions({
                parameters:updatedOutputParameters,
                graphType:'Bar Graph',
                xAxisParameter:'Date Range',
                yAxisParameter:updatedOutputParameters[0],
                startDate:dateRange.startDate,
                endDate:dateRange.endDate,
            });

            try{
            
            setTimeout(()=>{

                // const response=await axios.post(config.backend_api,inputData)

                const mergedData = {};

                const hasTemp = response?.data?.TEMP;
                const hasPH = response?.data?.pH;
                const hasBOD = response?.data?.BOD;
                const hasCOD = response?.data?.COD;
                const hasDO = response?.data?.DO;
                const hasFC = response?.data?.FC;
                const hasNitrate = response?.data?.Nitrate;

                    
                // Merge the data for dates present in any of the parameters
                const dates = new Set([
                    ...(hasTemp ? Object.keys(response?.data?.TEMP) : []),
                    ...(hasPH ? Object.keys(response?.data?.pH) : []),
                    ...(hasBOD ? Object.keys(response?.data?.BOD) : []),
                    ...(hasCOD ? Object.keys(response?.data?.COD) : []),
                    ...(hasDO ? Object.keys(response?.data?.DO) : []),
                    ...(hasFC ? Object.keys(response?.data?.FC) : []),
                    ...(hasNitrate ? Object.keys(response?.data?.Nitrate) : []),
                ]);
                    
                dates.forEach(date => {
                    mergedData[date] = {
                        TEMP: hasTemp ? response?.data?.TEMP[date] : null,
                        pH: hasPH ? response?.data?.pH[date] : null,
                        BOD: hasBOD ? response?.data?.BOD[date] : null,
                        COD: hasCOD ? response?.data?.COD[date] : null,
                        DO: hasDO ? response?.data?.DO[date] : null,
                        FC: hasFC ? response?.data?.FC[date] : null,
                        Nitrate: hasNitrate ? response?.data?.Nitrate[date] : null,
                    };
                });
                    
                console.log(mergedData);
            
                setOutputData({
                    isLoading:false,
                    output:mergedData
                });

            },2500);


            }
            catch(err){
                console.log("something went wrong",err);
            }
        }

    }

    const handleActiveSection=(section)=>{

        if(section=='analysis'){
            if(outputData.output!=''){
                setActiveSection('analysis');
            }
        }
        else{
            setActiveSection('input');
        }
    }
    
    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = 'Date,TEMP,pH,COD,BOD,DO,FC,Nitrate\r\n';
        
        for (let key in array) {
            let line = '';
            line += key + ','; // Date
            line += (array[key].TEMP !== undefined ? array[key].TEMP : 'null') + ','; // TEMP
            line += (array[key].pH !== undefined ? array[key].pH : 'null') + ','; // pH
            line += (array[key].COD !== undefined ? array[key].COD : 'null') + ','; // COD
            line += (array[key].BOD !== undefined ? array[key].BOD : 'null') + ','; // BOD
            line += (array[key].DO !== undefined ? array[key].DO : 'null') + ',';  // DO
            line += (array[key].FC !== undefined ? array[key].FC : 'null') + ','; // FC
            line += (array[key].Nitrate !== undefined ? array[key].Nitrate : 'null'); // Nitrate
            str += line + '\r\n';
        }
    
        return str;
    };
    
    const downloadCSV = (data) => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'data.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleDownloadReport=async()=>{

        try{

            const updatedInputParameters = parameters.map(param => param === 'pH' ? 'PH' : param);
            
            const inputData={
                coordinates:coordinateData.coordinate,
                startDate:dateRange.startDate,
                endDate:dateRange.endDate,
                waterParameter:updatedInputParameters,
            }

            if(coordinateData.waterBodyName!=''){
                inputData.waterBodyName = coordinateData.waterBodyName;
                inputData.generateReport="true";                   
            }
            
            const response=await axios.post(config.backend_api,inputData)
            
            console.log(response.data);

            if (response.data && typeof response.data === 'string') {
                // Open a new tab
                const newTab = window.open();
                if (newTab) {
                    // Write the HTML content to the new tab
                    newTab.document.write(response.data);
                    newTab.document.close(); // Ensure the document is fully loaded
                } else {
                    console.error("Popup blocked. Please allow popups for this site.");
                }
            } else {
                console.error("Invalid HTML response from the server.");
            }

        }
        catch(err){

        }

    }

    // console.log(coordinateData?.waterBodyName);
    console.log(analysisOptions);


    return(
        <div className={`w-[18%] relative border-r-4 pb-5 border-[#815A0D] h-full bg-[#212121] flex flex-col items-center gap-7`}>
            <div className="flex justify-between w-full"> 
                <button onClick={()=>handleActiveSection('input')} className={`w-1/2 h-[42px]  text-[#F00202] ${activeSection=='input' ? 'text-xl font-bold ' : 'text-sm font-normal bg-[#121111] '} `}>Input</button>
                <button onClick={()=>handleActiveSection('analysis')} className={`w-1/2 h-[42px] ${activeSection=='analysis' ? 'text-xl font-bold ' : 'text-sm font-normal bg-[#121111] '} ${outputData.output=='' ? 'text-red-800 cursor-not-allowed' : 'text-[#F00202] cursor-pointer'} `}>Analysis</button>
            </div>
            <div className="w-full h-full overflow-auto menu-bar-scrollbar ">
                {activeSection=='input' &&
                    <div className="w-full flex flex-col items-center">
                        <CustomCoordinate/>
                        <div className="py-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                        <ReservoirSelection/>
                        <div className="py-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                        <InputDateRange/>
                        <div className="py-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                        <InputParameterSelection/>
                        <div className="pt-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                    </div>
                }
                {activeSection=='analysis' &&
                    <div className="w-full flex flex-col items-center">
                        <GraphSelection/>
                        <div className="py-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                        <AnalysisParameterSelection/>
                        <div className="py-7"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                        <AnalysisDateRange/>    
                        <div className="pt-6"><p className="w-44 h-0.5 bg-gray-300"></p></div>
                    </div>
                }
                {isReportLoading && <div className="absolute top-0 left-0 h-full w-full backdrop-blur-sm flex justify-center items-center"><Loader/></div>}
                </div>
            {activeSection=='input' && <button onClick={handleSubmit} className={`bg-[#04507C] py-2.5 px-4 w-[230px] text-[15px] font-semibold transition-all duration-300 ${ (coordinateData.type === 'polygon' || coordinateData.type === 'state-district-reservoir' || coordinateData.type === 'drawnPolygon') && dateRange.startDate !== '' && dateRange.endDate !== '' && parameters.length !==0 ? 'hover:bg-[#00264C] cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'} text-gray-100 `}>GET RESULTS</button>}
            {activeSection=='analysis' && 
            <div className="flex flex-col gap-4">
                <button onClick={()=>downloadCSV(outputData.output)} className={`bg-[#04507C] py-2.5 px-4 w-[230px] text-[15px] font-semibold transition-all duration-300 hover:bg-[#00264C] cursor-pointer text-gray-100 `}>Download as CSV</button>
                <button onClick={handleDownloadReport} className={`bg-[#04507C] py-2.5 px-4 w-[230px] text-[15px] font-semibold transition-all duration-300 ${coordinateData.waterBodyName!='' ? 'hover:bg-[#00264C] cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'} text-gray-100`}>Download Full Report</button>
            </div>
            }
        </div>
    );

}

export default MenuBar;