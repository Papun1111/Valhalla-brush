"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiShare2, FiUsers, FiStar, FiGithub, FiDownload, FiLogOut } from "react-icons/fi";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("authorization");
    setIsLoggedIn(!!token);
  }, []);
  
  const handleLogout = () => {
    // Remove authorization from localStorage
    localStorage.removeItem("authorization");
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-64 h-64 rounded-full filter blur-3xl mx-auto mt-[-10rem]" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            VALLHALLA BRUSH
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto">
            Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool. No sign-up required.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="lg"
                className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transform hover:scale-105 transition"
              >
                Logout
                <FiLogOut className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transform hover:scale-105 transition">
                    Sign in
                    <FiEdit2 className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          {isLoggedIn && (
            <p className="mt-4">You are logged in</p>
          )}
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FiShare2,
                title: "Real-time Collaboration",
                desc: "Work together with your team in real-time. Share your drawings instantly with a simple link.",
              },
              {
                icon: FiUsers,
                title: "Multiplayer Editing",
                desc: "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time.",
              },
              {
                icon: FiStar,
                title: "Smart Drawing",
                desc: "Intelligent shape recognition and drawing assistance helps you create perfect diagrams.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="p-6 bg-gray-700 border border-gray-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-indigo-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-10 sm:p-16 shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white">
                Ready to start creating?
              </h2>
              <p className="mt-4 text-lg text-indigo-100 mx-auto max-w-xl">
                Join thousands of users who are already creating amazing diagrams and sketches.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {isLoggedIn ? (
                  <>
                    <Link href="/canvas">
                      <Button
                        size="lg"
                        variant="ghost"
                        className="h-12 px-8 bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transform hover:scale-105 transition"
                      >
                        Open Canvas
                        <FiEdit2 className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/slug">
                      <Button
                        variant="outline"
                        size="lg"
                        className="h-12 px-8 border-white text-white hover:bg-white hover:text-gray-900 transition"
                      >
                        Join Room
                      </Button>
                    </Link>
                  </>
                ) : (
                  <p>Please log in to access canvas and join room</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 bg-gray-900">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-gray-400">
              © 2025 ValhallaBrush. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition">
                <FiGithub className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiDownload className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
