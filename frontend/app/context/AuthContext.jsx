"use client"
import { createContext, useEffect, useState } from "react";

export const AuthContext=createContext(null);

const AuthContextProvider=({children})=>{

    const [isMounted,setIsMounted]=useState(false);
    const [user,setUser]=useState(null);

    useEffect(()=>{
        const storedUser=sessionStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        setIsMounted(true);
    },[]);

    useEffect(()=>{
        if(user){
            sessionStorage.setItem("user",JSON.stringify(user));
        }
        else{
            sessionStorage.removeItem("user");
        }
    },[user]);

    if(!isMounted) return null;

    const login=(userData)=>{
        setUser(userData);
    };

    const logout=()=>{
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContextProvider;