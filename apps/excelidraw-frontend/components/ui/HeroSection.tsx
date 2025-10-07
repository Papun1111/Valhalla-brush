import {FC} from "react"
import type { HeroSectionProps } from "@/utils/interfaces";
import { Button } from "@repo/ui/button";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import Link from "next/link";

export const HeroSection: FC<HeroSectionProps> = ({ isLoggedIn, handleLogout }) => (
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
              <div className="space-y-4">
                <Button
                  onClick={handleLogout}
                  className="h-14 px-12 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="font-medium tracking-wide">Logout</span>
                  <FiLogOut className="ml-3 h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Active session</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signup">
                  <Button
                    className="h-14 px-12 bg-stone-900 hover:bg-stone-800 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="font-medium tracking-wide">START</span>
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className="h-14 px-8 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-all duration-300"
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
        <div className="relative lg:pl-12">
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
            <div className="relative bg-gradient-to-br from-stone-50 to-stone-100 rounded-2xl p-8 border border-stone-200">
              <div className="absolute top-4 right-4 bg-white rounded-lg px-4 py-2 shadow-md flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-medium text-stone-700">LIVE</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-stone-800 to-stone-600 rounded-full"></div>
                  <div className="flex-1 h-3 bg-stone-300 rounded-full"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-lime-600 to-lime-500 rounded-full"></div>
                  <div className="flex-1 h-3 bg-stone-300 rounded-full"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-full"></div>
                  <div className="flex-1 h-3 bg-stone-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute -bottom-6 left-0 bg-stone-900 text-white rounded-2xl px-8 py-4 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full border-2 border-stone-900"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-stone-900"></div>
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
          <div className="text-center space-y-2">
            <div className="text-4xl font-light text-stone-900">1M+</div>
            <div className="text-sm text-stone-600 tracking-wide">Drawings Created</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-light text-stone-900">99.9%</div>
            <div className="text-sm text-stone-600 tracking-wide">Uptime Guarantee</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl font-light text-stone-900">24/7</div>
            <div className="text-sm text-stone-600 tracking-wide">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  </header>
);