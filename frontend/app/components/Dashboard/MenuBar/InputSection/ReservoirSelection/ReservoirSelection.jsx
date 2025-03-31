import { useContext, useEffect, useRef, useState } from "react";
import reservoirsData from "../../../../../../reservoirsData.json";
import { CoordinateContext } from "@/app/context/coordinateContext";

const OptionButton=({label,onClick})=>(
    <button onClick={onClick} className="block px-4 py-1.5 text-[15px] text-gray-500 hover:bg-[#04507C] hover:text-white w-full text-left">{label}</button>
);

const ReservoirSelection=()=>{

    const {coordinateData,setCoordinateData}=useContext(CoordinateContext);

    const [stateSelected,setStateSelected]=useState('');
    const [districtSelected,setDistrictSelected]=useState('');
    const [reservoirSelected,setReservoirSelected]=useState('');

    const [isStateOpen,setIsStateOpen]=useState(false);
    const [isDistrictOpen,setIsDistrictOpen]=useState(false);
    const [isReservoirOpen,setIsReservoirOpen]=useState(false);

    const stateDropDownRef=useRef(null);
    const districtDropDownRef=useRef(null);
    const reservoirDropDownRef=useRef(null);

    const handleStateSelection=(option)=>{

        const stateData=reservoirsData.find(stateData=>stateData.state===option);
        
        setCoordinateData({
            type:'state',
            coordinate:[stateData.coordinates.longitude,stateData.coordinates.latitude],
            waterBodyName:'',
        });

        setStateSelected(option);
        setIsStateOpen(false);

    }

    const handleDistrictSelection=(option)=>{

        const districtData = reservoirsData.find(stateData => stateData.state === stateSelected)
        .districts.find(districtData => districtData.district === option); 
        
        setCoordinateData({
            type:'state-district',
            coordinate:[districtData.coordinates.longitude,districtData.coordinates.latitude],
            waterBodyName:'',
        });

        setDistrictSelected(option);
        setIsDistrictOpen(false);
    }

    const handleReservoirSelection=(option)=>{
        
        const reservoirData = reservoirsData.find(stateData => stateData.state === stateSelected)
        .districts.find(districtData => districtData.district === districtSelected)
        .reservoirs.find(reservoirData => reservoirData.reservoir === option);


        const formattedCoordinates=formatCoordinates(reservoirData.coordinates);

        if(formattedCoordinates){

            const flattenedCoordinates = formattedCoordinates.flat();
            
            setCoordinateData({
                type:'state-district-reservoir',
                coordinate:flattenedCoordinates,
                waterBodyName:option,
            });

            // if(option=='Gangapur Dam'){
            //     setCoordinateData((prevOptions) => ({
            //         ...prevOptions,  
            //         waterBodyName:'gangapur_dam',
            //     }));
            // }

        }

        setReservoirSelected(option);
        setIsReservoirOpen(false);
    }

    const formatCoordinates = (input) => {
        try {
            if (Array.isArray(input) && Array.isArray(input[0])) {
                return input; 
            } else {
                console.error('Invalid coordinates format');
                return null;
            }
        } catch (error) {
            console.error('Failed to process coordinates', error);
            return null;
        }
    };
    
    useEffect(()=>{

        const handleClickOutside=(event)=>{

            if (stateDropDownRef.current && !stateDropDownRef.current.contains(event.target)) {
                setIsStateOpen(false);
            }
            if (districtDropDownRef.current && !districtDropDownRef.current.contains(event.target)) {
                setIsDistrictOpen(false);
            }
            if (reservoirDropDownRef.current && !reservoirDropDownRef.current.contains(event.target)) {
                setIsReservoirOpen(false);
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
                <label className="font-medium text-[15px]">State</label>
                <div ref={stateDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{setIsStateOpen(!isStateOpen)}} className={`flex justify-between items-center w-[230px] px-4 py-1.5 text-[15px] border ${coordinateData.type=='state' || coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir' ? 'text-[#815A0D] border-[#815A0D] font-semibold' : 'text-[#545454] border-[#545454] font-normal'} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        {coordinateData.type=='state' || coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir' ? stateSelected : 'Select State'}
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isStateOpen && (
                        <div className="absolute mt-0.5 right-0 w-[230px] z-10 origin-top-right bg-white shadow-lg">
                            <div>
                                {reservoirsData.map(stateData=>(
                                    <OptionButton key={stateData.state} label={stateData.state} onClick={()=>handleStateSelection(stateData.state)} />                        
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="font-medium text-[15px]">District</label>
                <div ref={districtDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{setIsDistrictOpen(!isDistrictOpen)}}  className={`flex justify-between items-center w-[230px] px-4 py-1.5 text-[15px] border  ${coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir' ? 'text-[#815A0D] border-[#815A0D] font-semibold' : 'text-[#545454] border-[#545454] font-normal'} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        {coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir' ? districtSelected : 'Select State'}
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isDistrictOpen && (coordinateData.type=='state' || coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir') && (
                        <div className="absolute mt-0.5 right-0 w-[230px] z-10 origin-top-right bg-white shadow-lg">
                            {reservoirsData
                                .find(stateData=>stateData.state===stateSelected)?.districts
                                .map(districtData=>(
                                    <OptionButton key={districtData.district} label={districtData.district} onClick={()=>handleDistrictSelection(districtData.district)}/>                       
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="font-medium text-[15px]">Reservoir</label>
                <div ref={reservoirDropDownRef} className="relative inline-block text-left" >
                    <button onClick={()=>{ setIsReservoirOpen(!isReservoirOpen) }}  className={`flex justify-between items-center w-[230px] px-4 py-1.5 text-[15px] border ${coordinateData.type=='state-district-reservoir' ? 'text-[#815A0D] border-[#815A0D] font-semibold' : 'text-[#545454] border-[#545454] font-normal'} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        <div className="truncate mr-2">{coordinateData.type=='state-district-reservoir' ? reservoirSelected : 'Select Reservoir'}</div>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                    </button>
                    {isReservoirOpen && (coordinateData.type=='state-district' || coordinateData.type=='state-district-reservoir') && (
                        <div className="absolute mt-0.5 right-0 w-[230px] z-10 origin-top-right bg-white shadow-lg">
                            {reservoirsData
                                .find(stateData=>stateData.state===stateSelected)?.districts
                                .find(districtData=>districtData.district===districtSelected)?.reservoirs
                                .map(reservoirData=>(
                                    <OptionButton key={reservoirData.reservoir} label={reservoirData.reservoir} onClick={()=>handleReservoirSelection(reservoirData.reservoir)}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default ReservoirSelection;