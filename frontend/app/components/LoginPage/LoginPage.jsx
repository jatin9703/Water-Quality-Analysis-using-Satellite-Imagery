import { useFormik } from "formik";
import Footer from "../Footer/Footer";
import { useContext, useState } from "react";
import Loader from "../Loader/Loader";
import { toast, Toaster } from "sonner";
import { AuthContext } from "@/app/context/authContext";
import config from "@/config";

const LoginPage=()=>{

    const {login}=useContext(AuthContext);
    const [isLoading,setIsLoading]=useState(false);

    const initialValues={
        name:"",
        password:""
    };

    const scrollToContactUs=()=>{
        window.scrollTo({
            top:document.body.scrollHeight,
            behavior:"smooth",
        });
    };

    const {values,handleBlur,handleChange,handleSubmit,handleReset}=useFormik({
        initialValues:initialValues,
        onSubmit:()=>{handleConnect(values)}
    });

    const handleConnect=(values)=>{
        console.log(values);
        setIsLoading(true);

        setTimeout(()=>{
            if(values.name!=config.username || values.password!=config.password){
                toast.error('Invalid Credentials !!! Please Try Again');
                handleReset();
            }
            else{
                login(values);
            }
            setIsLoading(false);
        },3000);
    };
    
    return(
        <div className='w-full h-screen relative'>
            <div className="w-full">
                <div className="w-full px-6 h-16 flex justify-between items-center bg-[#04507C]">
                    <div>
                        <p className="text-xl font-medium text-white">India Water Resource</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <p onClick={scrollToContactUs} className="text-[15px] hover:text-gray-400 transition-colors duration-300 cursor-pointer font-medium text-white">Contact Us</p>
                    </div> 
                </div>
                <div className="mt-1.5 w-full h-1 bg-[#815A0D]"></div>    
            </div>
            <div className={`z-10 bg-[#00264C] p-4 w-28 rounded-full absolute left-1/2 h-lg:top-[35%] top-[32%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${isLoading ? 'transition-all duration-300 ease-out' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="full" height="full">
                    <circle cx="50" cy="30" r="20" fill="white" stroke="black" strokeWidth="1" />
                    <path d="M10 85a40 40 0 0 1 80 0" fill="white" stroke="black" strokeWidth="1" />
                </svg>
            </div>
            <div className="relative w-full h-[calc(100vh-78px)] bg-black my-0.5">
                {isLoading && <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-[45%]"><Loader/></div>}
                <form onSubmit={handleSubmit} className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col ${isLoading ? 'transition-all duration-300' : ''} ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} bg-[#1F2020] border-b-[3px] border-b-[#815A0D] px-16 pt-16 pb-6`}>
                    <label className={`block mb-2 text-sm transition-all ease-in-out font-medium text-white`}>Your Name</label>
                    <div className="flex relative w-[350px] mb-3">                    
                        <span className={`inline-flex items-center px-3 text-sm transition-all ease-in-out text-gray-900 bg-gray-200 border-gray-300 border border-e-0`}>
                            <svg className={`w-5 h-5 transition-all ease-in-out text-gray-500`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                            </svg>
                        </span>
                        <input name="name" required value={values.name} onChange={handleChange} onBlur={handleBlur} type="text" id="name" className={`rounded-none transition-all ease-in-out  border block h-12 w-full p-2.5 border-gray-300 bg-gray-100  text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="Username"></input>
                    </div>
                    <label className={`block mb-2 text-sm  transition-all ease-in-out font-medium text-white `}>Your Password</label>
                    <div className="flex relative w-[350px] mb-6">                    
                        <span className={`inline-flex items-center px-3 text-sm transition-all ease-in-out text-gray-900 bg-gray-200 border-gray-300 border border-e-0  `}>
                            <svg className={`w-5 h-5 transition-all ease-in-out text-gray-500`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 1a5 5 0 0 1 5 5v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5Zm3 7V6a3 3 0 0 0-6 0v2h6Zm-3 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
                            </svg>
                        </span>
                        <input type="password" required name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} id="password" className={`rounded-none transition-all ease-in-out  border block h-12 w-full p-2.5 border-gray-300 bg-gray-100 text-gray-900 focus:ring-blue-500 focus:border-blue-500`} placeholder="*********"></input>
                    </div>
                    <div className="flex mt-3 w-full justify-center">
                        <button type="submit" className={`py-2.5 transition-all duration-300 hover:bg-[#00264C] ease-in-out px-8 font-bold text-[15px] bg-[#04507C] text-white`}>LOGIN</button>
                    </div>
                </form>
                <Toaster className="mt-14" richColors position="top-right"/>
            </div>
            <Footer/>
        </div>
    );

};

export default LoginPage;
