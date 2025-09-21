import {FC} from "react"
import type { HeroSectionProps } from "@/utils/interfaces";
import { Button } from "@repo/ui/button";
import { FiEdit2, FiLogOut, FiZap } from "react-icons/fi";
import Link from "next/link";

export const HeroSection: FC<HeroSectionProps> = ({ isLoggedIn, handleLogout }) => (
  <header className="relative z-10 overflow-hidden py-24">
    <div className="absolute inset-0 opacity-30">
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 w-96 h-96 rounded-full filter blur-3xl mx-auto mt-[-12rem] animate-bounce-slow"></div>
    </div>
    <div className="relative container mx-auto px-4 text-center">
      <div className="animate-fade-in-up">
        <h1 className="text-6xl font-black sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 tracking-tight hover:scale-105 transition-transform duration-700 cursor-default">
          VALHALLA BRUSH
        </h1>
        <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full animate-pulse"></div>
      </div>

      <p className="mt-8 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:300ms]">
        The ultimate collaborative drawing platform where creativity meets
        technology. Design, sketch, and brainstorm with your team in real-time.
        Experience the future of digital creativity.
      </p>

      <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in-up [animation-delay:600ms]">
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="lg"
            className="h-14 px-10 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-2xl transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 border border-red-500/50 hover:border-red-400 hover:shadow-red-500/25"
          >
            <span className="font-semibold">Logout</span>
            <FiLogOut className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
          </Button>
        ) : (
          <>
            <Link href="/signin">
              <Button
                variant="ghost"
                size="lg"
                className="h-14 px-10 border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl group"
              >
                <span className="font-semibold">Sign In</span>
                <FiEdit2 className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-1000" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="ghost"
                size="lg"
                className="h-14 px-10 border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl group"
              >
                <span className="font-semibold">Sign Up</span>
                <FiZap className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </Button>
            </Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <div className="mt-8 animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <p className="text-green-400 font-medium">
              You are logged in and ready to create
            </p>
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in-up [animation-delay:900ms]">
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
            50K+
          </div>
          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            Active Users
          </div>
        </div>
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            1M+
          </div>
          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            Drawings Created
          </div>
        </div>
        <div className="text-center group hover:scale-105 transition-transform duration-300">
          <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
            99.9%
          </div>
          <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            Uptime
          </div>
        </div>
      </div>
    </div>
  </header>
);
