"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import { Search, ArrowRight, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function FindJoinRoom() {
  const [slug, setSlug] = useState("");
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFind = async () => {
    // FIX 1: Reset both error and previous success states on a new search.
    setError(null);
    setRoomId(""); 
    setLoading(true);

    try {
      const response = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(slug.trim())}`
      );

      const roomData = response.data.room;
      if (!roomData || !roomData.id) {
        throw new Error("The requested room could not be found.");
      }
      setRoomId(String(roomData.id));
    } catch (err: unknown) {
      // The error handling logic here is already excellent.
      let message = "Failed to find room. Please check the slug and try again.";
      
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    if (roomId) {
      router.push(`/canvas/${encodeURIComponent(roomId)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-stone-100 to-stone-200 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-stone-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-stone-400/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-stone-600 tracking-wide mb-4">
            <div className="w-8 h-px bg-stone-400"></div>
            <span className="uppercase">Find Room</span>
          </div>
          <h1 className="text-4xl font-light text-stone-900 mb-3 leading-tight">
            Search by<br /><span className="font-serif italic">room slug</span>
          </h1>
          <p className="text-stone-600 text-sm">
            Enter the unique slug to find and join a room.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg">
          <div className="space-y-6">
            {/* Search Input */}
            <div>
              <label
                htmlFor="slug"
                className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2"
              >
                Room Slug
              </label>
              <div className="relative">
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g., creative-collaboration"
                  className="w-full px-4 py-3 pl-11 bg-stone-50 border border-stone-300 
                             text-stone-900 rounded-lg placeholder-stone-400
                             focus:ring-2 focus:ring-stone-400 focus:border-transparent
                             transition-all duration-200 outline-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && slug.trim() && !loading) {
                      handleFind();
                    }
                  }}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-stone-400" />
                </div>
              </div>
            </div>

            {/* Find Button */}
            <button
              onClick={handleFind}
              disabled={!slug.trim() || loading}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800
                         disabled:bg-stone-400 disabled:cursor-not-allowed
                         text-white font-medium rounded-lg 
                         transition-all duration-200 
                         focus:ring-2 focus:ring-stone-400 outline-none
                         flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Room</span>
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 text-sm font-medium mb-1">Search Failed</p>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message & Join Button */}
            {roomId && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-green-900 text-sm font-medium mb-1">Room Found!</p>
                    <p className="text-green-800 text-xs">
                      {/* FIX 2: Better confirmation text */}
                      Click below to join the room with slug: <code className="bg-white px-1.5 py-0.5 rounded border border-green-200 font-mono text-green-900">{slug.trim()}</code>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleJoin}
                  className="w-full py-3 bg-green-700 hover:bg-green-800
                               text-white font-medium rounded-lg 
                               transition-all duration-200 
                               focus:ring-2 focus:ring-green-400 outline-none
                               flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Join Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-stone-500 text-xs">
            Search and join collaborative rooms
          </p>
        </div>
      </div>

    
    </div>
  );
}