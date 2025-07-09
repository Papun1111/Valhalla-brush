"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiShare2, FiUsers, FiStar, FiGithub, FiDownload, FiLogOut, FiZap, FiLayers, FiClock, FiShield, FiCloud } from "react-icons/fi";
import { toast } from "react-toastify";

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
    toast.dark("Logout successfull!")
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <header className="relative z-10 overflow-hidden py-24">
        <div className="absolute inset-0 opacity-30">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 w-96 h-96 rounded-full filter blur-3xl mx-auto mt-[-12rem] animate-bounce slow-bounce"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl font-black sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-blue-200 tracking-tight hover:scale-105 transition-transform duration-700 cursor-default">
              VALHALLA BRUSH
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full animate-pulse"></div>
          </div>
          
          <p className="mt-8 text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            The ultimate collaborative drawing platform where creativity meets technology. Design, sketch, and brainstorm with your team in real-time. Experience the future of digital creativity.
          </p>
          
          <div className="mt-12 flex items-center justify-center gap-x-6 animate-fade-in-up animation-delay-600">
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
                    className="h-14 px-10 border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl group">
                    <span className="font-semibold">Sign In</span>
                    <FiEdit2 className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-1000" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="h-14 px-10 border-2 border-gray-600 text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-xl hover:shadow-2xl group">
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
                <p className="text-green-400 font-medium">You are logged in and ready to create</p>
              </div>
            </div>
          )}
          
          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 animate-fade-in-up animation-delay-900">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">50K+</div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Active Users</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">1M+</div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Drawings Created</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">99.9%</div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Uptime</div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 hover:text-purple-300 transition-colors duration-500">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, collaborate, and share your ideas with the world
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FiShare2,
                title: "Real-time Collaboration",
                desc: "Work together with your team in real-time. Share your drawings instantly with a simple link and watch as ideas come to life together.",
                color: "from-purple-500 to-blue-500",
                hoverColor: "group-hover:from-purple-400 group-hover:to-blue-400"
              },
              {
                icon: FiUsers,
                title: "Multiplayer Editing",
                desc: "Multiple users can edit the same canvas simultaneously. See who's drawing what in real-time with live cursors and collaborative tools.",
                color: "from-blue-500 to-cyan-500",
                hoverColor: "group-hover:from-blue-400 group-hover:to-cyan-400"
              },
              {
                icon: FiStar,
                title: "Smart Drawing",
                desc: "Intelligent shape recognition and drawing assistance helps you create perfect diagrams. AI-powered suggestions make creating easier.",
                color: "from-cyan-500 to-teal-500",
                hoverColor: "group-hover:from-cyan-400 group-hover:to-teal-400"
              },
              {
                icon: FiLayers,
                title: "Layer Management",
                desc: "Organize your work with unlimited layers. Non-destructive editing with blend modes, opacity controls, and layer effects.",
                color: "from-green-500 to-yellow-500",
                hoverColor: "group-hover:from-green-400 group-hover:to-yellow-400"
              },
              {
                icon: FiCloud,
                title: "Cloud Sync",
                desc: "Your work is automatically saved and synced across all devices. Access your projects anywhere, anytime with seamless cloud integration.",
                color: "from-yellow-500 to-orange-500",
                hoverColor: "group-hover:from-yellow-400 group-hover:to-orange-400"
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="group p-8 bg-gray-900/50 border border-gray-800 rounded-3xl shadow-2xl hover:shadow-purple-500/10 transform hover:-translate-y-3 hover:scale-105 transition-all duration-500 backdrop-blur-sm hover:border-purple-500/30 animate-fade-in-up"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} ${feature.hoverColor} transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-7 w-7 text-white group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.desc}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"></div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative z-10 py-24 bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <h3 className="text-4xl font-bold text-white mb-6 hover:text-purple-300 transition-colors duration-500">
                Why Choose ValhallaBrush?
              </h3>
              <div className="space-y-6">
                {[
                  { icon: FiZap, title: "Lightning Fast", desc: "Optimized for performance with 60fps drawing and instant collaboration" },
                  { icon: FiShield, title: "Secure & Private", desc: "End-to-end encryption keeps your creative work safe and confidential" },
                  { icon: FiClock, title: "Version History", desc: "Never lose your progress with automatic saves and complete version control" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 group hover:bg-gray-800/30 p-4 rounded-xl transition-all duration-300">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">{item.title}</h4>
                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="animate-fade-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gray-900 border border-gray-700 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500">
                  <h4 className="text-2xl font-bold text-white mb-4">Trusted by Teams Worldwide</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-300">
                      <div className="text-2xl font-bold text-purple-400">150+</div>
                      <div className="text-gray-400">Countries</div>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors duration-300">
                      <div className="text-2xl font-bold text-blue-400">24/7</div>
                      <div className="text-gray-400">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl p-12 sm:p-20 shadow-2xl border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative text-center">
              <h2 className="text-5xl font-black text-white mb-6 group-hover:scale-105 transition-transform duration-500">
                Ready to start creating?
              </h2>
              <p className="mt-6 text-xl text-gray-300 mx-auto max-w-2xl leading-relaxed">
                Join thousands of creators, designers, and teams who are already bringing their ideas to life with ValhallaBrush. Start your creative journey today.
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
                    <p className="text-xl text-purple-300 mb-6 animate-pulse">Please sign in to access the canvas and join collaborative rooms</p>
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

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4 hover:text-purple-300 transition-colors duration-300">
                ValhallaBrush
              </h3>
              <p className="text-gray-400 max-w-md leading-relaxed">
                The ultimate collaborative drawing platform that brings teams together through the power of visual creativity and real-time collaboration.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Documentation', 'Contact', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 hover:translate-x-1 inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              © 2025 ValhallaBrush. All rights reserved. Crafted with ❤️ by <a className="decoration-inherit underline" href="https://papun-mohapatra.vercel.app/">Papun</a> for creators worldwide.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com" className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform">
                <FiGithub className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform">
                <FiDownload className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white hover:scale-125 transition-all duration-300 transform">
                <FiShare2 className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        .slow-bounce {
          animation: bounce 3s infinite;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-900 {
          animation-delay: 900ms;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-left {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in-right {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
