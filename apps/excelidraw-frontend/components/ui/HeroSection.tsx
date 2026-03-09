"use client";

import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@repo/ui/button";
import { FiEdit2, FiLogOut, FiArrowRight, FiLayout } from "react-icons/fi";
import Link from "next/link";

export const HeroSection: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("authorization", tokenFromUrl);
        axios.defaults.headers.common["Authorization"] = tokenFromUrl;
        setIsLoggedIn(true);
        toast.success("🚀 Login Verified!", { theme: "dark", autoClose: 3000 });
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

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
    <header className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0c]">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-br from-violet-600/20 to-indigo-800/10 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/15 to-orange-600/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-[80px] animate-[pulse_12s_ease-in-out_infinite_4s]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Noise texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Floating navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/25">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </div>
            <span className="text-white/90 font-bold text-lg tracking-tight">Valhalla<span className="text-violet-400">Brush</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white/90 transition-colors duration-300">Features</a>
            <a href="#about" className="hover:text-white/90 transition-colors duration-300">About</a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 lg:px-12 max-w-7xl pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — Copy */}
          <div className={`space-y-8 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 shadow-lg shadow-black/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="uppercase font-semibold tracking-[0.2em] text-[11px] text-white/60">Collaborative Canvas</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white leading-[0.95]">
                <span className="block">Draw.</span>
                <span className="block bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Collaborate.</span>
                <span className="block">Create.</span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="text-lg text-white/40 leading-relaxed max-w-lg">
              A powerful real-time whiteboard for teams. Sketch diagrams, explain concepts, and brainstorm ideas — together, from anywhere.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 min-h-[64px]">
              {isLoggedIn ? (
                <div className="flex flex-wrap gap-4">
                  <Link href="/canvas">
                    <Button className="h-14 px-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl transition-all duration-300 shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 transform hover:-translate-y-0.5 flex items-center gap-3 border border-violet-500/30 font-bold tracking-wide">
                      Enter Canvas
                      <FiArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/slug">
                    <Button className="h-14 px-10 bg-white/5 backdrop-blur-xl hover:bg-white/10 text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-3 shadow-lg shadow-black/20 font-medium tracking-wide">
                      Your Rooms
                      <FiLayout className="h-5 w-5 opacity-70" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="h-14 px-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 flex items-center gap-2"
                  >
                    Logout
                    <FiLogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-5">
                  <Link href="/signup">
                    <Button className="relative group h-14 px-12 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden shadow-xl shadow-violet-600/25 hover:shadow-violet-500/40 border border-violet-500/30">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative font-bold tracking-[0.15em] text-sm z-10">START FREE</span>
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button
                      variant="ghost"
                      className="h-14 px-8 text-white/50 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10 font-medium"
                    >
                      Sign In
                      <FiEdit2 className="ml-3 h-4 w-4 opacity-70" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {["from-violet-400 to-indigo-500", "from-cyan-400 to-blue-500", "from-amber-400 to-orange-500", "from-emerald-400 to-teal-500"].map((g, i) => (
                  <div key={i} className={`w-9 h-9 bg-gradient-to-br ${g} rounded-full border-2 border-[#0a0a0c] shadow-lg`} />
                ))}
              </div>
              <div className="text-sm">
                <span className="text-white/80 font-semibold">2,000+</span>
                <span className="text-white/30 ml-1.5">active creators</span>
              </div>
            </div>
          </div>

          {/* Right — Interactive Canvas Preview */}
          <div className={`relative lg:pl-8 hidden lg:block transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
            <div className="relative group">
              {/* Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-cyan-600/20 rounded-[32px] blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-1000" />

              {/* Card */}
              <div className="relative bg-[#141418] backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/50 border border-white/[0.08] overflow-hidden transition-all duration-500 group-hover:border-white/[0.12] group-hover:shadow-violet-900/20">
                {/* Window bar */}
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-lg shadow-red-500/30" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-lg shadow-yellow-500/30" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-lg shadow-green-500/30" />
                  <div className="ml-auto flex items-center gap-2 text-[11px] text-white/30 font-mono">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    valhalla-room-1
                  </div>
                </div>

                {/* Canvas area */}
                <div className="h-80 bg-[#0c0c0e] flex items-center justify-center relative overflow-hidden">
                  {/* Subtle grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px]" />

                  <div className="transform scale-[0.85] group-hover:scale-100 transition-transform duration-700">
                    <div className="relative">
                      {/* Animated cursor */}
                      <div className="absolute top-0 right-0 z-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700">
                        <svg className="w-5 h-5 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" fill="currentColor" viewBox="0 0 24 24"><path d="M4.004 22V2l19.5 9.5-10.45 2.15L9.623 22H4.004z"/></svg>
                        <div className="bg-violet-600 text-white text-[9px] px-2 py-0.5 rounded-md shadow-lg shadow-violet-600/40 mt-0.5 ml-3 font-mono tracking-wide">You</div>
                      </div>

                      {/* Second cursor */}
                      <div className="absolute bottom-4 left-4 z-20 opacity-60 animate-[bounce_3s_ease-in-out_infinite]">
                        <svg className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" fill="currentColor" viewBox="0 0 24 24"><path d="M4.004 22V2l19.5 9.5-10.45 2.15L9.623 22H4.004z"/></svg>
                        <div className="bg-cyan-600 text-white text-[9px] px-2 py-0.5 rounded-md shadow-lg shadow-cyan-600/40 mt-0.5 ml-3 font-mono tracking-wide">Alex</div>
                      </div>

                      <svg width="320" height="280" viewBox="0 0 124 124" fill="none" className="drop-shadow-2xl">
                        <rect width="124" height="124" rx="24" fill="url(#gradient-hero)" />
                        <path d="M19.375 36.7818V100.625C19.375 102.834 21.1659 104.625 23.375 104.625H87.2181C90.7818 104.625 92.5664 100.316 90.0466 97.7966L26.2034 33.9534C23.6836 31.4336 19.375 33.2182 19.375 36.7818Z" fill="white" opacity="0.9"/>
                        <circle cx="63.2109" cy="37.5391" r="18.1641" fill="#1a1a2e"/>
                        <rect opacity="0.7" x="81.1328" y="80.7198" width="17.5687" height="17.3876" rx="4" transform="rotate(-45 81.1328 80.7198)" fill="#a78bfa"/>
                        <defs>
                          <linearGradient id="gradient-hero" x1="0" y1="0" x2="124" y2="124" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#7c3aed"/>
                            <stop offset="1" stopColor="#4f46e5"/>
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom toolbar preview */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                  {["◻", "○", "△", "✏", "↗", "T"].map((s, i) => (
                    <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition-colors ${i === 3 ? "bg-violet-500/20 text-violet-400" : "text-white/25 hover:text-white/40 hover:bg-white/5"}`}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </header>
  );
};