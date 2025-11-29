"use client";

import { FC, useEffect, useState, ReactNode } from "react";
// --- Original Imports (Uncomment in local project) ---
// import { Button } from "@repo/ui/button";
// import { FiEdit2, FiLogOut, FiArrowRight, FiLayout } from "react-icons/fi"; 
// import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";

// --- PREVIEW MOCKS (Remove in local project) ---
const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} style={{ textDecoration: 'none' }}>{children}</a>
);

const Button = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: ReactNode; 
  className?: string; 
  variant?: "primary" | "ghost"; 
  onClick?: () => void; 
}) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center font-medium transition-all duration-300 ${className}`}
  >
    {children}
  </button>
);

const FiArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);
const FiLogOut = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const FiEdit2 = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const FiLayout = ({ className }: { className?: string }) => (
  <svg className={className} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
);
// -----------------------------------------------

export const HeroSection: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Check if Backend sent us a token via URL (This handles the Google Redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      // A. Save the fresh token
      localStorage.setItem("authorization", tokenFromUrl);
      
      // B. Set global headers
      axios.defaults.headers.common["Authorization"] = tokenFromUrl;
      
      // C. Update State
      setIsLoggedIn(true);
      
      // D. Show Success & Clean URL
      toast.success("🚀 Google Login Verified!", { 
        theme: "dark",
        position: "bottom-right",
        autoClose: 4000
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } 
    else {
      // 2. Fallback: Check LocalStorage if no URL token exists
      const token = localStorage.getItem("authorization");
      if (token) {
        setIsLoggedIn(true);
        axios.defaults.headers.common["Authorization"] = token;
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authorization");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    toast.info("Logout successful!", { theme: "dark" });
  };

  return (
    <header className="relative overflow-hidden py-32 bg-gradient-to-b from-stone-100 via-stone-50 to-white">
      {/* Subtle background element */}
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

            <div className="pt-4">
              {isLoggedIn ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   {/* --- LOGGED IN STATE --- */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Primary Action: Go to Canvas */}
                    <Link href="/canvas"> 
                      <Button
                        className="h-14 px-10 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                      >
                        <span className="font-medium tracking-wide">Go to Canvas</span>
                        <FiArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>

                    {/* Secondary Action: Logout */}
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="h-14 px-8 text-stone-600 hover:text-red-600 hover:bg-stone-100 rounded-full transition-all duration-300 flex items-center gap-2"
                    >
                      <span>Logout</span>
                      <FiLogOut className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 text-sm text-stone-500 pl-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span>System Online & Ready</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                   {/* --- LOGGED OUT STATE --- */}
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

          {/* Right Content - Feature Card */}
          <div className="relative lg:pl-12 hidden lg:block">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-stone-200 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
              {/* Category Pills */}
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-medium border border-stone-200">
                  Real-time
                </span>
                <span className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full text-sm font-medium border border-stone-200">
                  Canvas
                </span>
                <span className="px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-medium">
                  Collaborate
                </span>
              </div>

              <h3 className="text-3xl font-light text-stone-900 mb-4">
                Unique design &<br />ergonomics
              </h3>
              
              <p className="text-stone-600 mb-8 leading-relaxed">
                From concepts to masterpieces. Experience seamless collaboration with your team in real-time.
              </p>

              {/* Feature Preview */}
              <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-8 border border-stone-200 overflow-hidden">
                 {/* Decorative Grid */}
                 <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur rounded-lg px-4 py-2 shadow-sm flex items-center gap-2 border border-stone-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-stone-700">LIVE</span>
                </div>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-stone-200 shadow-sm rounded-full flex items-center justify-center text-stone-400">
                      <FiLayout />
                    </div>
                    <div className="flex-1 h-3 bg-stone-200 rounded-full w-2/3"></div>
                  </div>
                  <div className="flex items-center gap-3 pl-8">
                    <div className="w-8 h-8 bg-gradient-to-br from-stone-700 to-stone-600 rounded-full shadow-lg ring-2 ring-white"></div>
                     <div className="p-3 bg-white rounded-xl rounded-tl-none shadow-sm border border-stone-100 text-xs text-stone-500">
                       Adding some details here...
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="absolute -bottom-6 left-0 bg-stone-900 text-white rounded-2xl px-8 py-4 shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10 rounded-full border-2 border-stone-900 bg-stone-800" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="User" className="w-10 h-10 rounded-full border-2 border-stone-900 bg-stone-800" />
                  <div className="w-10 h-10 rounded-full border-2 border-stone-900 bg-stone-800 flex items-center justify-center text-xs font-bold">+4</div>
                </div>
                <div>
                  <div className="text-2xl font-light">50k+</div>
                  <div className="text-xs text-stone-400 tracking-wide">Active Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-24 pt-12 border-t border-stone-200">
          <div className="grid grid-cols-3 gap-8 max-w-4xl">
            <div className="text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-light text-stone-900">1M+</div>
              <div className="text-sm text-stone-600 tracking-wide">Drawings Created</div>
            </div>
            <div className="text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-light text-stone-900">99.9%</div>
              <div className="text-sm text-stone-600 tracking-wide">Uptime Guarantee</div>
            </div>
            <div className="text-center space-y-2 hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-light text-stone-900">24/7</div>
              <div className="text-sm text-stone-600 tracking-wide">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};