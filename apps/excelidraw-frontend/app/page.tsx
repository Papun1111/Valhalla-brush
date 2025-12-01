"use client";

import type { FC } from "react";
import { ToastContainer } from "react-toastify";


// Component Imports
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { AdditionalInfoSection } from "@/components/ui/AdditionalnfoSection";

import { FeaturesSection } from "@/components/ui/FeatureSection";
import { CtaSection } from "@/components/ui/CtaSection";

const App: FC = () => {
  // Logic has been moved to HeroSection.tsx
  // This component now purely handles layout assembly.

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
      
      <CtaSection /> 
      
      <Footer />
    </div>
  
  );
};

export default App;