import { useContext, useEffect, useState } from "react";
import { CoordinateContext } from "@/app/context/coordinateContext";

const ParameterSelection=()=>{

    const {setParameters,parameters}=useContext(CoordinateContext);

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);

    const [checkboxes, setCheckboxes] = useState({
      TEMP: false,
      PH: false,
      BOD: false,
    //   COD: false,
      DO:false,
      FC:false,
      NT:false,
    });
    const [isAllChecked, setIsAllChecked] = useState(false);
  
    // Handle "All" checkbox toggle
    const handleAllChange = (e) => {

        const checked = e.target.checked;
        
        setIsAllChecked(checked);
        
        setCheckboxes({
            TEMP: checked,
            PH: checked,
            BOD: checked,
            // COD: checked,
            DO:checked,
            FC:checked,
            NT:checked,
        });
        
    };
  
    // Handle individual checkbox changes
    const handleCheckboxChange = (e) => {

        const { name, checked } = e.target;

        setCheckboxes((prev) => {
            const updatedCheckboxes = { ...prev, [name]: checked };
  
            // If any individual checkbox is unchecked, uncheck the "All" checkbox
            if (!checked) {
                setIsAllChecked(false);
            }
  
            // If all checkboxes are checked, check the "All" checkbox
            const allChecked = Object.values(updatedCheckboxes).every((val) => val);
            if (allChecked) {
                setIsAllChecked(true);
            }
        
            return updatedCheckboxes;

        });
    };

    const handleSubmit=()=>{

        const selectedParameters = Object.keys(checkboxes).filter(key => checkboxes[key]);

        setParameters(selectedParameters);

        setIsPopUpOpen(!isPopUpOpen);
    }

    useEffect(() => {
        if (isPopUpOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isPopUpOpen]);


    return(
        <div className="flex flex-col gap-1.5 text-white">
            <label className="font-medium text-[15px]">Parameters</label>
            <button onClick={()=>setIsPopUpOpen(!isPopUpOpen)} className={`flex gap-2 items-center w-[230px] px-4 py-1.5 text-[15px] border ${parameters.length==0 ? "text-[#545454] border-[#545454] font-normal" : "text-[#815A0D] border-[#815A0D] font-semibold"} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                {parameters.length!=0 ? 'Parameters Selected' : 'Select Parameters'}</button>
                {isPopUpOpen && (
                <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
                    <div className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl"></div>
                    <div className={`absolute border select-none border-gray-700 min-w-[550px] gap-7 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out px-10 py-7 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                        <svg onClick={()=>setIsPopUpOpen(!isPopUpOpen)} xmlns="http://www.w3.org/2000/svg" className="absolute top-1.5 right-1.5 w-6 h-6 text-gray-600 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        <div className="text-[18px] mt-2 font-medium">Parameter Selection</div>
                        <div className="flex flex-col gap-3 self-start w-full px-4">
                            <div className="flex justify-between items-center">
                                <label htmlFor="all" className="cursor-pointer">All</label>
                                <input type="checkbox" id="all" checked={isAllChecked} onChange={handleAllChange} className="cursor-pointer"/>
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="temperature" className="cursor-pointer">Temperature</label>
                                <input type="checkbox" id="temperature" name="TEMP" checked={checkboxes.TEMP} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="PH" className="cursor-pointer">pH</label>
                                <input type="checkbox" id="PH" name="PH" checked={checkboxes.PH} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="DO" className="cursor-pointer">Dissolved Oxygen (DO)</label>
                                <input type="checkbox" id="DO" name="DO" checked={checkboxes.DO} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="FC" className="cursor-pointer">Fecal Coliform (FC)</label>
                                <input type="checkbox" id="FC" name="FC" checked={checkboxes.FC} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="NT" className="cursor-pointer">Nitrate</label>
                                <input type="checkbox" id="NT" name="NT" checked={checkboxes.NT} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="BOD" className="cursor-pointer">Biological Oxygen Demand (BOD)</label>
                                <input type="checkbox" id="BOD" name="BOD" checked={checkboxes.BOD} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div>
                            {/* <div className="flex justify-between items-center">
                                <label htmlFor="COD" className="cursor-pointer">Chemical Oxygen Demand (COD)</label>
                                <input type="checkbox" id="COD" name="COD" checked={checkboxes.COD} onChange={handleCheckboxChange} className="cursor-pointer" />
                            </div> */}
                        </div>
                        <button onClick={handleSubmit} type="submit" className={`py-2 mt-2 transition-all duration-300 hover:bg-green-700 ease-in-out px-8 font-semibold text-[15px] bg-green-500 text-white`}>SUBMIT</button>
                    </div>
               </div> 
            )}        
        </div>
    );

}

export default ParameterSelection;