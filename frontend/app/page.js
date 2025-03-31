"use client"
import { use, useContext } from "react";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/Footer/Footer";
import LoginPage from "./components/LoginPage/LoginPage";
import NavBar from "./components/NavBar/NavBar";
import { AuthContext } from "./context/authContext";

const Page=()=>{

    const {user}=useContext(AuthContext);

    console.log(user);

    return(
        <div className="w-full flex flex-col bg-white">
            {user ? (
                <div>
                    <NavBar/>
                    <Dashboard/>
                    <Footer/>
                </div>
            ):(
                <LoginPage/>
            )}
        </div>
    );

}

export default Page;