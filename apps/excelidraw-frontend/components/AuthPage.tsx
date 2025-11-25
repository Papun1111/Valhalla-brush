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
        const authHeader = `${token}`;
        localStorage.setItem("authorization", authHeader);
        axios.defaults.headers.common["Authorization"] = authHeader;

        // Success toast for sign in
        toast.success("🎉 Welcome back! Signed in successfully", {
          transition: Zoom,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to home after short delay
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        // Clear form fields after successful signup
        setUsername("");
        setName("");
        setPassword("");

        toast.success("✨ Account created successfully! Please sign in", {
          transition: Zoom,
          position: "top-center",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to signin after short delay
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Authentication error:", err);
      
      // Enhanced error messages
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.error ||
        (isSignin 
          ? "Sign in failed. Please check your credentials." 
          : "Sign up failed. Username may already exist.");
      
      toast.error(`❌ ${errorMessage}`, {
        transition: Zoom,
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
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
      {/* Animated Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-delayed-2"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob-delayed-4"></div>
      </div>

      {/* Main form container with enhanced styling */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 border border-stone-200/50 transition-all duration-300 hover:shadow-3xl">
          {/* Header with enhanced styling */}
          <div className="text-center space-y-2">
            <div className="inline-block p-3 bg-gradient-to-br from-stone-600 to-stone-800 rounded-xl mb-2 shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSignin ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                )}
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
              {isSignin ? "Sign In" : "Sign Up"}
            </h1>
            <p className="text-stone-600 font-medium">
              {isSignin ? (
                <>
                  Welcome back{" "}
                  <span className="inline-block animate-hand-wave">👋</span>
                </>
              ) : (
                <>
                  Create your account{" "}
                  <span className="inline-block animate-bounce">✨</span>
                </>
              )}
            </p>
            <p className="text-sm text-stone-500">
              {isSignin
                ? "Enter your credentials to continue"
                : "Join thousands of creators worldwide"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field with icon */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-stone-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200 hover:border-stone-400"
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Name Field (Sign Up Only) with icon */}
            {!isSignin && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-stone-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-stone-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200 hover:border-stone-400"
                    placeholder="Enter full name"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Password Field with icon */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-stone-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-stone-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent transition-all duration-200 hover:border-stone-400"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-stone-700 to-stone-900 text-white font-semibold py-3 px-6 rounded-xl hover:from-stone-800 hover:to-black transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isSignin ? "Sign In" : "Create Account"}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              )}
            </button>

            {/* Enhanced Additional Info */}
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

              {/* Enhanced Security note */}
              <div className="flex items-center justify-center gap-2 text-xs text-stone-500 bg-stone-50 py-2 px-4 rounded-lg border border-stone-200">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secured with industry-standard encryption
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-blob-delayed-2 {
          animation: blob 7s infinite;
          animation-delay: 2s;
        }
        
        .animate-blob-delayed-4 {
          animation: blob 7s infinite;
          animation-delay: 4s;
        }
        
        @keyframes handWave {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(20deg);
          }
          75% {
            transform: rotate(-20deg);
          }
        }
        
        .animate-hand-wave {
          animation: handWave 1.5s infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}