import { useState, useEffect, useRef, useContext } from "react";
import PasteCoordinatePopUp from "./PasteCoordinatePopUp/PasteCoordinatePopUp";
import UploadCoordinateFile from "./UploadCoordinateFile/UploadCoordinateFile";
import { CoordinateContext } from "@/app/context/coordinateContext";

const OptionButton=({ label, onClick })=>(
    <button onClick={onClick} className="block px-4 py-1.5 text-[15px] text-gray-500 hover:bg-[#04507C] hover:text-white w-full text-left">{label}</button>
);

const CustomCoordinate=()=>{

    const {coordinateData}=useContext(CoordinateContext);
    
    const [selected,setSelected]=useState('');
    const [isOpen,setIsOpen]=useState(false);
    const dropDownRef=useRef(null);

    const [isPopUpOpen,setIsPopUpOpen]=useState(false);

    const handleSelection=(option)=>{
        setSelected(option);
        setIsOpen(false);
        setIsPopUpOpen(true);
    };

    useEffect(()=>{

        const handleClickOutside=(event)=>{

            if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return()=>{
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    useEffect(() => {
        if (isPopUpOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isPopUpOpen]);
    

    return (
        <div className="flex flex-col gap-1.5 text-white">
            <label className="font-medium text-[15px]">Custom Coordinate</label>
            <div ref={dropDownRef} className="relative inline-block text-left" >
                <button onClick={()=>{setIsOpen(!isOpen)}}  className={`flex justify-between items-center w-[230px] px-4 py-1.5 text-[15px] border ${coordinateData.type=='polygon' || coordinateData.type=='drawnPolygon' ? 'text-[#815A0D] border-[#815A0D] font-semibold' : 'font-normal text-[#545454] border-[#545454]'} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                    {coordinateData.type=='polygon' ? selected : coordinateData.type=='drawnPolygon' ? 'Polygon Drawn' : 'Select Type'}
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h12l-6 6z" /></svg>
                </button>
                {isOpen && (
                    <div className="absolute mt-0.5 right-0 w-[230px] origin-top-right bg-white shadow-lg">
                        <div>
                            <OptionButton label="Upload coordinate file" onClick={() => handleSelection('Upload coordinate file')} />
                            <OptionButton label="Paste copied coordinate" onClick={() => handleSelection('Paste copied coordinate')} />
                        </div>
                    </div>
                )}
                {selected=='Upload coordinate file' && isPopUpOpen && 
                    <UploadCoordinateFile isPopUpOpen={isPopUpOpen} setIsPopUpOpen={setIsPopUpOpen}/>
                }
                {selected=='Paste copied coordinate' && isPopUpOpen && 
                    <PasteCoordinatePopUp isPopUpOpen={isPopUpOpen} setIsPopUpOpen={setIsPopUpOpen}/>
                }
            </div>
        </div>
    );
};

export default CustomCoordinate;
