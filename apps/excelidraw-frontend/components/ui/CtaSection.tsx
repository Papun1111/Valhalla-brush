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
      <div className="relative bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl p-12 sm:p-20 shadow-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="relative text-center">
          <h2 className="text-5xl font-black text-white mb-6 group-hover:scale-105 transition-transform duration-500">
            Ready to start creating?
          </h2>
          <p className="mt-6 text-xl text-gray-300 mx-auto max-w-2xl leading-relaxed">
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
                    className="h-16 px-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white border-2 border-gray-600 hover:from-gray-700 hover:to-gray-800 hover:border-purple-500 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 group"
                  >
                    <span className="font-bold text-lg">Open Canvas</span>
                    <FiEdit2 className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
                <Link href="/slug">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-12 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-purple-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/25 group"
                  >
                    <span className="font-bold text-lg">Join Room</span>
                    <FiUsers className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                  </Button>
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-xl text-purple-300 mb-6 animate-pulse">
                  Please sign in to access the canvas and join collaborative
                  rooms
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/signin">
                    <Button className="h-14 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-110 transition-all duration-300">
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