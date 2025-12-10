"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@repo/ui/button";
import Link from "next/link";
import { FiEdit2, FiUsers, FiArrowRight } from "react-icons/fi";

export const CtaSection: FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Check for existing token
    const token = localStorage.getItem("authorization");

    // 2. Check for URL token
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    const hasToken = !!(token || tokenFromUrl);

    // FIX: Add this guard clause.
    // Only call setState if the value is actually different.
    // This prevents the "cascading render" warning when the logic re-runs.
    if (hasToken && !isLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]); // Add isLoggedIn to dependency array

  return (
    <section className="relative py-24 bg-white">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="relative bg-stone-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>

          {/* Content */}
          <div className="relative px-8 py-16 lg:p-20">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
                Ready to start
                <br />
                <span className="font-serif italic">creating</span>?
              </h2>

              <p className="text-lg text-stone-300 leading-relaxed mb-12 max-w-2xl mx-auto">
                Join thousands of creators, designers, and teams who are already
                bringing their ideas to life with ValhallaBrush.
              </p>

              {isLoggedIn ? (
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Link href="/canvas">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-14 px-12 bg-white text-stone-900 hover:bg-stone-100 rounded-full font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                    >
                      <span className="text-black">Open Canvas</span>
                      <FiEdit2 className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Link href="/slug">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 px-12 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full font-medium tracking-wide transition-all duration-300 group"
                    >
                      <span>Join Room</span>
                      <FiUsers className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-stone-400 text-sm">
                    <div className="w-2 h-2 bg-stone-500 rounded-full"></div>
                    <span>
                      Sign in to access the canvas and collaborative rooms
                    </span>
                  </div>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="h-14 px-12 bg-white text-black hover:bg-stone-100 rounded-full font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                      >
                        <span className="text-black">Get Started</span>
                        <FiArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                    <Link href="/signin">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-14 px-12 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 rounded-full font-medium tracking-wide transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Stats bar */}
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
                <div>
                  <div className="text-3xl font-light text-white mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-stone-400 tracking-wide">
                    Active Users
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">
                    1M+
                  </div>
                  <div className="text-sm text-stone-400 tracking-wide">
                    Drawings
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-light text-white mb-2">
                    150+
                  </div>
                  <div className="text-sm text-stone-400 tracking-wide">
                    Countries
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};