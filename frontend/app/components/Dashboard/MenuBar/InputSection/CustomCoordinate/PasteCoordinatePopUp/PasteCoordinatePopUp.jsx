import { CoordinateContext } from "@/app/context/coordinateContext";
import { useContext, useState } from "react";
import { toast, Toaster } from "sonner";

const PasteCoordinatePopUp=({isPopUpOpen,setIsPopUpOpen})=>{

    const {setCoordinateData}=useContext(CoordinateContext);
    
    const [clipboardContent,setClipboardContent]=useState('');

    const handlePaste=async()=>{
        try{
            const clipboardText=await navigator.clipboard.readText();
            setClipboardContent(clipboardText);
            console.log(clipboardContent);
        }
        catch(error){
            console.error('Failed to read clipboard contents',error);
        }
    };

    const handleInputChange=(event)=>{
        setClipboardContent(event.target.value);
    }

    const formatCoordinates = (input) => {
        try {
            const parsed = JSON.parse(input);

            // Check if it's a valid array with the expected structure
            if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
                return parsed; // Return the valid array of coordinates
            } else {
                toast.error('Invalid coordinates format');
                // return null;
            }
        }catch (error) {
            // console.error('Failed to parse coordinates', error);
            toast.error('Invalid coordinates format');
            // return null;
        }
    };

    const handleSubmit=()=>{

        const formattedCoordinates=formatCoordinates(clipboardContent);

        if(formattedCoordinates){
            const flattenedCoordinates = formattedCoordinates.flat();

            setCoordinateData({
                type:'polygon',
                coordinate:flattenedCoordinates,
            });

            setIsPopUpOpen(!isPopUpOpen);

        }
        
    }

    return(
        <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
            <div onClick={()=>{setIsPopUpOpen(!isPopUpOpen); toast.dismiss();}} className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl"></div>
            <div className={`absolute border border-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out px-10 pb-7 pt-9 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-[450px] h-72">
                        <textarea onChange={handleInputChange} value={clipboardContent} className="w-full h-full overflow-auto text-[15px] bg-white text-black placeholder-transparent resize-none"></textarea>
                        {!clipboardContent && (
                            <span className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                Paste your copied coordinates by clicking on the 'PASTE' button
                            </span>
                        )}
                    </div>
                    {clipboardContent!='' ? (
                        <div className="flex w-full justify-center gap-10">
                            <button onClick={()=>{setClipboardContent('')}} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-red-800 ease-in-out px-8 font-semibold text-[15px] bg-red-600 text-white`}>DELETE</button>
                            <button onClick={handleSubmit} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-green-700 ease-in-out px-8 font-semibold text-[15px] bg-green-500 text-white`}>SUBMIT</button>
                        </div>
                    ):(
                        <button onClick={handlePaste} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-green-700 ease-in-out px-8 font-semibold text-[15px] bg-green-500 text-white`}>PASTE</button>
                    )}
                </div>
            </div>
            <Toaster richColors position="top-right"/>
        </div>        
    );

}

export default PasteCoordinatePopUp;