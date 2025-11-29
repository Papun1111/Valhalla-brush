/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // --- NEW GOOGLE LOGIC ---
  // We no longer handle the 'code' here. 
  // We simply send the user to the backend to start the flow.
  const handleGoogleLogin = () => {
    // Redirect browser to your Backend's Google Auth endpoint
    // The backend will redirect to Google -> Handle Callback -> Redirect to Home with Token
    window.location.href = `${HTTP_BACKEND}/auth/google`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (isSignin) {
        const token = data.token;
        localStorage.setItem("authorization", token);
        axios.defaults.headers.common["Authorization"] = token;

        toast.success("🎉 Welcome back! Signed in successfully", {
          transition: Zoom,
        });

        // Redirect to home with verify flag
        setTimeout(() => {
          router.push("/?login=success");
        }, 1000);
      } else {
        setUsername("");
        setName("");
        setPassword("");

        toast.success("✨ Account created successfully! Please sign in", {
          transition: Zoom,
        });

        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (isSignin
          ? "Sign in failed. Check your credentials."
          : "Sign up failed. Username may exist.");

      toast.error(`❌ ${errorMessage}`, {
        transition: Zoom,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-delayed-2"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-delayed-4"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 border border-stone-200/50 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl mb-2 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSignin ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                )}
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
              {isSignin ? "Sign In" : "Sign Up"}
            </h1>
            <p className="text-stone-600 font-medium">
              {isSignin ? <>Welcome back <span className="inline-block animate-hand-wave">👋</span></> : <>Create your account <span className="inline-block animate-bounce">✨</span></>}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* --- GOOGLE BUTTON --- */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-stone-700 font-semibold py-3 px-6 rounded-xl border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isSignin ? "Sign in with Google" : "Sign up with Google"}
            </button>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-stone-300"></div>
              <span className="flex-shrink-0 mx-4 text-stone-400 text-xs uppercase tracking-widest font-medium">Or continue with</span>
              <div className="flex-grow border-t border-stone-300"></div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-stone-700">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Name Input (Sign Up Only) */}
            {!isSignin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter full name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-stone-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-stone-700 to-stone-900 text-white font-semibold py-3 px-6 rounded-xl hover:from-stone-800 hover:to-black transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignin ? "Sign In" : "Create Account"}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>

            <div className="text-center space-y-3">
              <p className="text-sm text-stone-600">
                {isSignin ? "New here? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => handleNavigate(isSignin ? "/signup" : "/signin")}
                  className="text-stone-900 hover:text-stone-700 cursor-pointer font-semibold underline decoration-stone-400 decoration-2 underline-offset-2 hover:decoration-stone-600 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isSignin ? "Create an account" : "Sign in"}
                </button>
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500 bg-stone-50 py-2 px-4 rounded-lg border border-stone-200">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secured with industry-standard encryption
              </div>
            </div>
          </form>
        </div>
      </div>
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animate-blob-delayed-2 { animation: blob 7s infinite; animation-delay: 2s; }
        .animate-blob-delayed-4 { animation: blob 7s infinite; animation-delay: 4s; }
        @keyframes handWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-hand-wave { animation: handWave 1.5s infinite; display: inline-block; transform-origin: 70% 70%; }
      `}</style>
    </div>
  );
}