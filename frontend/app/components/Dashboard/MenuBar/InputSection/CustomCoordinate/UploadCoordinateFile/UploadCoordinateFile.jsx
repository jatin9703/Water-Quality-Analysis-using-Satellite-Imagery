import { CoordinateContext } from "@/app/context/coordinateContext";
import { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const UploadCoordinateFile = ({ isPopUpOpen, setIsPopUpOpen }) => {
    const { setCoordinateData } = useContext(CoordinateContext);
    const [fileContent, setFileContent] = useState('');

    useEffect(() => {
        if (fileContent !== '') {
            const formattedCoordinates = formatCoordinates(fileContent);
            if (formattedCoordinates) {
                setCoordinateData((prev) => ({
                    type: 'polygon',
                    coordinate: formattedCoordinates.flat(),
                    waterBodyName: prev.waterBodyName, // Preserve waterBodyName
                }));
                setIsPopUpOpen(!isPopUpOpen);
            }
        }
    }, [fileContent]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "text/plain") {
                const reader = new FileReader();
                reader.onload = () => {
                    setFileContent(reader.result);
                    const filename = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

                    const formattedCoordinates = formatCoordinates(reader.result);
                    if (formattedCoordinates) {
                        setCoordinateData({
                            type: 'polygon',
                            coordinate: formattedCoordinates.flat(),
                            waterBodyName: filename, // Set file name as waterBodyName
                        });
                        setIsPopUpOpen(!isPopUpOpen);
                    }
                };
                reader.readAsText(file);
            } else {
                toast.error("Please upload a valid .txt file.");
            }
        }
    };

    const formatCoordinates = (input) => {
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
                return parsed;
            } else {
                toast.error('Invalid coordinates format');
                return null;
            }
        } catch (error) {
            toast.error('Invalid coordinates format');
            return null;
        }
    };

    const handleUpload = () => {
        document.getElementById("fileInput").click();
    };

    return (
        <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
            <div onClick={() => { setIsPopUpOpen(!isPopUpOpen); toast.dismiss(); }} 
                className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl">
            </div>
            <div className={`absolute border border-gray-700 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out px-10 py-9 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-[450px] h-72 border border-gray-600 bg-white gap-2 flex flex-col justify-center items-center">
                        <button onClick={handleUpload} type="button" className={`py-2.5 transition-all duration-300 hover:bg-blue-700 ease-in-out px-8 font-semibold text-[15px] bg-blue-500 text-white`}>UPLOAD</button>
                        <p className="text-gray-400 text-[17px]">or drop a file</p>
                        <input id="fileInput" type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
            <Toaster richColors position="top-right"/>
        </div>
    );
};

export default UploadCoordinateFile;
