"use client"
import React, { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VerifyMailPage(){
    const [token, setToken]= React.useState("");
    const [error, setError]= React.useState(false);
    const [verified, setVerified]= React.useState(false);

    const verifyUserEmail= async ()=>{
        try {
            await axios.post('/api/users/verifymail', {token})
            setVerified(true)
            setError(false)
            
        } catch (error:any) {
            setError(true);
            console.log(error.response.data);
            
        }

    }

    useEffect(()=>{
        setError(false)
        const urlToken=window.location.search.split("=")[1]
        setToken(urlToken||"")

    })
    useEffect(()=>{
        setError(false)
        if( token.length>0 ){
            verifyUserEmail()
            }
    },[token])


    return(
        <div className="flex flex-col items-center justify-center min-h-screen py-2">

            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 gap-x-4 bg-blue-500 text-black rounded-2xl">{token ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                    
                </div>
            )}
        </div>
    )
}