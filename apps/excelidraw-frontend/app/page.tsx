"use client";

import type { FC } from "react";

import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { AdditionalInfoSection } from "@/components/ui/AdditionalnfoSection";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";

import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FeaturesSection } from "@/components/ui/FeatureSection";
import { CtaSection } from "@/components/ui/CtaSection";

const App: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {

    const token = localStorage.getItem("authorization");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("authorization");
    setIsLoggedIn(false);
    toast.dark("Logout successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-300 to-indigo-600 text-gray-100 overflow-x-hidden">
      <AnimatedBackground />
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
      <HeroSection isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <FeaturesSection />
      <AdditionalInfoSection />
      <CtaSection isLoggedIn={isLoggedIn} />
      <Footer />
    </div>
  );
};

export default App;
