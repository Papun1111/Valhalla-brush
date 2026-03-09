"use client";

import { useEffect, type FC } from "react";
import { ToastContainer } from "react-toastify";


// Component Imports
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { AdditionalInfoSection } from "@/components/ui/AdditionalnfoSection";

import { FeaturesSection } from "@/components/ui/FeatureSection";


const App: FC = () => {
  // Extract Google OAuth token from URL after redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authorization", token);
      // Clean the URL to remove the token query param
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);


  return (
    <div className="min-h-screen bg-transparent text-gray-100 overflow-x-hidden relative">

      
      <ToastContainer 
        theme="dark" 
        position="bottom-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover 
      />

      <HeroSection />
      
      <FeaturesSection />
      
      <AdditionalInfoSection />
      

      
      <Footer />
    </div>
  
  );
};

export default App;