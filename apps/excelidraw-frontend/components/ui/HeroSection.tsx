"use client";

import { FC, useEffect, useState, ReactNode } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// --- ORIGINAL IMPORTS (Uncomment in local project) ---
import { Button } from "@repo/ui/button";
import { FiEdit2, FiLogOut, FiArrowRight, FiLayout } from "react-icons/fi"; 
import Link from "next/link";


export const HeroSection: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // This function handles all auth checks to prevent race conditions
    const checkAuth = () => {
      // 1. Priority: Token from URL (Fresh Login via Backend Redirect)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");
      
      if (tokenFromUrl) {
        localStorage.setItem("authorization", tokenFromUrl);
        axios.defaults.headers.common["Authorization"] = tokenFromUrl;
        setIsLoggedIn(true);
        
        toast.success("🚀 Login Verified!", { theme: "dark", autoClose: 3000 });
        
        // Clean URL without refresh
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // 2. Fallback: Token from Storage (Existing Session)
      const storedToken = localStorage.getItem("authorization");
      if (storedToken) {
        setIsLoggedIn(true);
        axios.defaults.headers.common["Authorization"] = storedToken;
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authorization");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    toast.info("Logout successful!", { theme: "dark" });
  };

  return (
    <header className="relative overflow-hidden py-32 bg-gradient-to-b from-stone-100 via-stone-50 to-white">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="bg-gradient-to-br from-stone-200/30 via-transparent to-stone-300/20 w-[800px] h-[800px] rounded-full filter blur-3xl absolute top-0 right-0 -translate-y-1/2"></div>
      </div>
      
      <div className="relative container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 text-sm text-stone-600 tracking-wide mb-6">
                <div className="w-8 h-px bg-stone-400"></div>
                <span className="uppercase">Premium Digital Canvas</span>
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-stone-900 leading-[0.95]">
                THE
                <br />
                <span className="font-serif italic text-stone-800">Valhalla</span>
                <br />
                BRUSH<sup className="text-3xl">®</sup>
              </h1>
              
              <div className="flex items-center gap-3 text-stone-700">
                <span className="text-lg">/</span>
                <p className="text-lg font-light tracking-wide">
                  We craft collaborative experiences
                </p>
                <span className="text-lg">/</span>
              </div>
            </div>

            <div className="pt-4 h-24"> 
              {/* h-24 reserves space to prevent layout shift */}
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Link href="/canvas"> 
                    <Button
                      className="h-14 px-10 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                    >
                      <span className="font-medium tracking-wide">Go to Canvas</span>
                      <FiArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
<Link href="/slug"> 
                    <Button
                      className="h-14 px-10 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                    >
                      <span className="font-medium tracking-wide">Go to Rooms</span>
                      <FiArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="h-14 px-8 text-stone-600 hover:text-red-600 hover:bg-black rounded-full transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Logout</span>
                    <FiLogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Link href="/signup">
                    <Button
                      className="h-14 px-12 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="font-medium tracking-wide">START FREE</span>
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button
                      variant="ghost"
                      className="h-14 px-8 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-300 border border-stone-200 hover:border-stone-300"
                    >
                      <span className="font-medium tracking-wide">Sign In</span>
                      <FiEdit2 className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Canvas Preview */}
          <div className="relative lg:pl-12 hidden lg:block">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-stone-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
               {/* Content */}
               <div className="h-64 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 overflow-hidden relative">
                  {/* Restored SVG Preview */}
                  <div className="transform scale-90 opacity-90">
                    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 124 124" fill="none">
                      <rect width="124" height="124" rx="24" fill="#F97316"/>
                      <path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="white"/>
                      <circle cx="63.2109" cy="37.5391" r="18.1641" fill="black"/>
                      <rect opacity="0.4" x="81.1328" y="80.7198" width="17.5687" height="17.3876" rx="4" transform="rotate(-45 81.1328 80.7198)" fill="#FDBA74"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="text-sm font-medium text-stone-500 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm">Interactive Preview</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};