import { CoordinateContext } from "@/app/context/coordinateContext";
import { Datepicker } from "flowbite-react";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

const DateRange = () => {

    const {dateRange,setDateRange}=useContext(CoordinateContext);

    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);

    const startDateDropDownRef = useRef(null);
    const endDateDropDownRef = useRef(null);

    const formatDate = (date) => {
        return date instanceof Date
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
            : date;
    };

    const handleStartDateSelection = (date) => {

        if(date==null){
            setDateRange((prevState) => ({
                ...prevState,
                startDate: '', 
            }));
        }
        else{
            const formattedDate = formatDate(date);

            if (dateRange.endDate && new Date(formattedDate) > new Date(dateRange.endDate)) {
                setDateRange((prevState) => ({
                    ...prevState,
                    startDate: '',
                }));
                toast.error('Start date cannot be after end date');
                return;
            }
            
            setDateRange((prevState) => ({
                ...prevState,
                startDate: formattedDate, 
            }));
        }

        toast.dismiss();
        setIsStartDateOpen(false);
    };
    

    const handleEndDateSelection = (date) => {
    
        if(date==null){
            setDateRange((prevState) => ({
                ...prevState,
                endDate: '',
            }));
        }
        else{
            const formattedDate = formatDate(date);

            if (dateRange.startDate && new Date(formattedDate) < new Date(dateRange.startDate)) {

                setDateRange((prevState) => ({
                    ...prevState,
                    endDate: '',
                }));
                toast.error('End date cannot be before start date');
                return;
            }

            setDateRange((prevState) => ({
                ...prevState,
                endDate: formattedDate, 
            }));
        }

        toast.dismiss();
        setIsEndDateOpen(false);
    };

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (startDateDropDownRef.current && !startDateDropDownRef.current.contains(event.target)) {
                setIsStartDateOpen(false);
            }
            if (endDateDropDownRef.current && !endDateDropDownRef.current.contains(event.target)) {
                setIsEndDateOpen(false);   
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    useEffect(() => {
        if (isStartDateOpen || isEndDateOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isStartDateOpen, isEndDateOpen]);


    return (
        <div className="flex flex-col gap-1.5 text-white">
            <label className="font-medium text-[15px]">Date Range</label>
            <div className="flex flex-col gap-2">
                <div ref={startDateDropDownRef} className="inline-block text-left">
                    <button onClick={()=>setIsStartDateOpen(!isStartDateOpen)} className={`flex gap-2 items-center w-[230px] px-4 py-1.5 text-[15px] border ${dateRange.startDate=='' ? "text-[#545454] border-[#545454] font-normal" : "text-[#815A0D] border-[#815A0D] font-semibold"} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z" />
                        </svg>
                        {dateRange.startDate!='' ? dateRange.startDate : 'Start Date'}
                    </button>
                    {isStartDateOpen && (
                        <div onClick={()=>setIsStartDateOpen(!isStartDateOpen)} className="fixed w-full h-screen top-0 right-0 backdrop-blur-lg z-20">
                            <div onClick={(e)=>e.stopPropagation()} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[230px]">
                                <Datepicker
                                    inline
                                    title="Start Date Selection"
                                    onChange={(date) => handleStartDateSelection(date)}
                                    minDate={new Date(2010, 0, 1)}
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div ref={endDateDropDownRef} className="inline-block text-left">
                    <button onClick={()=>setIsEndDateOpen(!isEndDateOpen)} className={`flex gap-2 items-center w-[230px] px-4 py-1.5 text-[15px] border ${dateRange.endDate=='' ? "text-[#545454] border-[#545454] font-normal" : "font-semibold text-[#815A0D] border-[#815A0D]"} focus:border-[#815A0D] focus:ring-2 focus:ring-[#815A0D] focus:ring-opacity-50`}>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">   
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z" />
                        </svg>
                        {dateRange.endDate!='' ? dateRange.endDate : 'End Date'}
                    </button>
                    {isEndDateOpen && (
                        <div onClick={() => setIsEndDateOpen(!isEndDateOpen)} className="fixed w-full h-screen top-0 right-0 backdrop-blur-lg z-20">
                            <div onClick={(e)=>e.stopPropagation()} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[230px]">
                                <Datepicker
                                    inline
                                    title="End Date Selection"
                                    onChange={(date) => handleEndDateSelection(date)}
                                    minDate={new Date(2010, 0, 1)}
                                    maxDate={new Date()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Toaster richColors position="top-right"/>
        </div>
    );
};

export default DateRange;
