
import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Geist, Geist_Mono } from "next/font/google";
import SessionWrapper from "../Components/SessionWrapper";
import "./globals.css";
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import Navbar from "../Components/NavBar";
import theme from '../theme';
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import {Toaster} from "react-hot-toast";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});



export const metadata = {
  title: "My WebApp",
  description: "Next.js app with global layout",
};

export default function RootLayout({
  children,
}: Readonly<{  
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body
      >
        <AppRouterCacheProvider 
        options={{ key: 'css' }}>
          <ThemeProvider theme={theme}>
        <SessionWrapper>
        <div className=" min-h-screen pt-16 h-full bg-gradient-to-tr from-pink-400 via-purple-500 to-indigo-600 ">
      <Navbar />
        {children}
        </div>  
        <Toaster position="top-right" reverseOrder={false} />
    
        </SessionWrapper>
        </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
