"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Zoom } from "react-toastify";
import { HTTP_BACKEND } from "@/config";

interface AuthPageProps {
  isSignin: boolean;
}

export default function AuthPage({ isSignin }: AuthPageProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const endpoint = isSignin
      ? `${HTTP_BACKEND}/signin`
      : `${HTTP_BACKEND}/signup`;
    const payload = isSignin
      ? { username, password }
      : { username, name, password };

    try {
      const response = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const data = response.data;
      if (isSignin) {
        const token = data.token;
        const authHeader = `${token}`;
        localStorage.setItem("authorization", authHeader);
        axios.defaults.headers.common["Authorization"] = authHeader;
      }
      toast.dark("Authentication successfully completed", {
        transition: Zoom,
        delay: 200,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Auth failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-stone-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main form container */}
        <div className="bg-white border border-stone-200 rounded-2xl p-10 shadow-xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 text-sm text-stone-600 tracking-wide mb-6">
              <div className="w-8 h-px bg-stone-400"></div>
              <span className="uppercase">{isSignin ? "Sign In" : "Sign Up"}</span>
            </div>
            <h2 className="text-4xl font-light text-stone-900 mb-3 leading-tight">
              {isSignin ? (
                <>Welcome<br /><span className="font-serif italic">back</span></>
              ) : (
                <>Create your<br /><span className="font-serif italic">account</span></>
              )}
            </h2>
            <p className="text-stone-600 text-sm">
              {isSignin 
                ? "Enter your credentials to continue" 
                : "Join thousands of creators worldwide"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter username"
                required
              />
            </div>

            {/* Name Field (Sign Up Only) */}
            {!isSignin && (
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-stone-900 text-white py-3 px-6 rounded-lg font-medium tracking-wide shadow-lg hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <span>{isSignin ? "Sign In" : "Create Account"}</span>
              )}
            </button>

            {/* Additional Info */}
            <div className="text-center pt-6">
              <p className="text-stone-600 text-sm">
                {isSignin ? "New here? " : "Already have an account? "}
                <span 
                  onClick={isSignin ? () => router.push('signup') : () => router.push('signin')} 
                  className="text-stone-900 hover:text-stone-700 cursor-pointer font-medium underline decoration-stone-300 transition-colors duration-200"
                >
                  {isSignin ? "Create an account" : "Sign in"}
                </span>
              </p>
            </div>
          </form>
        </div>

        {/* Security note */}
        <div className="mt-6 text-center">
          <p className="text-stone-500 text-xs flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secured with industry-standard encryption</span>
          </p>
        </div>
      </div>
    </div>
  );
}