import { Button } from "@repo/ui/button";
import Link from "next/link";
import { FC } from "react";
import { FiEdit2, FiUsers } from "react-icons/fi";

interface CtaSectionProps {
  isLoggedIn: boolean;
}

export const CtaSection: FC<CtaSectionProps> = ({ isLoggedIn }) => (
  <section className="relative z-10 py-32">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-r from-stone-600/20 to-red-600/20 rounded-3xl p-12 sm:p-20 shadow-2xl border border-lime-500/20 backdrop-blur-sm hover:border-lime-500/40 transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-lime-600/10 to-red-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative text-center">
          <h2 className="text-5xl font-black text-stone-800 mb-6 group-hover:scale-105 transition-transform duration-500">
            Ready to start creating?
          </h2>
          <p className="mt-6 text-xl text-stone-600 mx-auto max-w-2xl leading-relaxed">
            Join thousands of creators, designers, and teams who are already
            bringing their ideas to life with ValhallaBrush. Start your creative
            journey today.
          </p>
          <div className="mt-12 flex items-center justify-center gap-x-8 flex-wrap">
            {isLoggedIn ? (
              <>
                <Link href="/canvas">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="h-16 px-12 bg-gradient-to-r from-stone-800 to-stone-900 text-white border-2 border-stone-600 hover:from-stone-700 hover:to-stone-800 hover:border-lime-500 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-2xl hover:shadow-lime-500/25 group"
                  >
                    <span className="font-bold text-lg">Open Canvas</span>
                    <FiEdit2 className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/slug">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-12 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-red-500/25 group"
                  >
                    <span className="font-bold text-lg">Join Room</span>
                    <FiUsers className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-xl text-lime-600 mb-6 animate-pulse">
                  Please sign in to access the canvas and join collaborative
                  rooms
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/signin">
                    <Button className="h-14 px-8 bg-gradient-to-r from-lime-600 to-red-600 hover:from-lime-500 hover:to-red-500 transform hover:scale-110 transition-all duration-300">
                      Get Started Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);