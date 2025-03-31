import { AuthContext } from "@/app/context/authContext";
import { useContext, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { CoordinateContext } from "@/app/context/coordinateContext";

const NavBar = () => {

    const {user,logout} = useContext(AuthContext);
    const {setCoordinateData,setDateRange,setParameters,setOutputData,setAnalysisOptions}=useContext(CoordinateContext);

    const [logoutPopUp,setLogoutPopUp]=useState(false);
    const [isLoading,setIsLoading]=useState(false);

    const scrollToContactUs = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    };

    const handleLogOut=()=>{
        setIsLoading(true);
        
        setTimeout(()=>{
            
            setIsLoading(false);
            setLogoutPopUp(false);
            
            setCoordinateData({
                coordinate:'',
                type:'',
            });
            
            setDateRange({
                startDate:'',
                endDate:'',
            });

            setParameters([]);

            setOutputData({
                isLoading:false,
                output:'',
            });

            setAnalysisOptions({
                parameters:[],
                graphType:'Bar Graph',
                xAxisParameter:'Date Range',
                yAxisParameter:'',
                startDate:'',
                endDate:'',
            });

            logout();

        },1500);
    }

    useEffect(() => {
        if (logoutPopUp) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [logoutPopUp]);

    return (
        <div className="w-full">
            <div className="w-full px-6 h-16 flex justify-between items-center bg-[#04507C]">
                <div className="">
                    <p className="text-xl cursor-pointer font-medium text-white">India Water Resource</p>
                </div>
                <div className="flex items-center gap-8">
                    <p onClick={scrollToContactUs} className="text-[15px] hover:text-gray-400 transition-colors duration-300 cursor-pointer font-medium text-white">Contact Us</p>
                    <p onClick={()=>setLogoutPopUp(!logoutPopUp)} className="text-[15px] cursor-pointer font-medium hover:text-red-600 transition-colors duration-300 text-white">Log Out</p>
                    <div className="group w-10">
                        <svg className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="full" height="full">
                            <circle cx="50" cy="30" r="20" fill="white" stroke="black" strokeWidth="2"/>
                            <path d="M10 85a40 40 0 0 1 80 0" fill="white" stroke="black" strokeWidth="2"/>
                        </svg>
                        <div className="absolute hidden group-hover:flex gap-1 z-20 text-white bg-[#222222] border-b-2 border-b-[#815A0D] py-3 pl-4 pr-8 flex-col top-14 right-10">
                            <p className="text-sm">Name : <span className="font-medium">{user.name}</span></p>
                            <p className="text-sm">ID : <span className="font-medium">NSC2433101</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-1.5 w-full h-1 bg-[#815A0D]"></div>
            {logoutPopUp && (
                <div className={`fixed w-full h-screen top-0 left-0 z-20`}>
                    {isLoading && <div className="absolute z-30 top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-[50%]"><Loader/></div>}
                    <div onClick={()=>setLogoutPopUp(!logoutPopUp)} className="w-full h-screen absolute top-0 left-0 backdrop-blur-xl"></div>
                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col transition-all duration-100 ease-in-out ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} gap-5 px-10 py-7 items-center border-b-[3px] border-b-[#815A0D] bg-[#222222]`}>
                        <p className="text-lg text-gray-200">Are you sure you want to Logout?</p>
                        <div className="flex gap-3">
                            <button onClick={()=>setLogoutPopUp(!logoutPopUp)} className={`py-2.5 transition-all duration-300 hover:bg-[#00264C] ease-in-out px-8 font-semibold text-[15px] bg-[#04507C] text-white`}>CANCEL</button>
                            <button onClick={handleLogOut} type="submit" className={`py-2.5 transition-all duration-300 hover:bg-red-800 ease-in-out px-8 font-semibold text-[15px] bg-red-600 text-white`}>LOGOUT</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavBar;
