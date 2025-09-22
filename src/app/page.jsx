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
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Animation />; // show skeleton while session loads
  }

  if (status === "authenticated") {
    router.replace("/Dashboard"); // redirect
    return null; // don't render anything while redirecting
  }

  return <LoginCard />; // show login if not authenticated
}