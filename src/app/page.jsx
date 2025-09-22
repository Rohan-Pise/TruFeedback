"use client"
import {signIn , signOut , useSession} from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/NavBar";
import {Box} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LoginCard from "../Components/LoginCard";
import { useEffect } from "react";
import Animation from "../Components/SkeletonAnimation"

export default function Home() {
    const router = useRouter();
  const {data:session,status} = useSession();

  useEffect(()=>{
    console.log("Session status: " , status , session);
    if(status === "authenticated"){
      router.replace("/Dashboard");
    }
  },[status,session,router])

  return (
    <div  >

       <main className="container mx-auto flex flex-col justify-center  h-[90vh] ">
         {/* <h1 className="container mx-auto bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center text-white opacity-90 font-bold text-2xl max-w-3xl">
          Welcome to TruFeedback – A convenient platform to receive anonymous
          feedback & messages
        </h1> */}
        <div className="">
          <Box 
   display="flex"
   justifyContent='center'
   alignItems='center'
   >
        {status === "loading" ? (<Animation/>):(<LoginCard/>)}
        </Box>
        </div>
       </main>
    </div>
  );
}
