"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function FindJoinRoom() {
  const [slug, setSlug] = useState("");
  const [roomId, setRoomId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFind = async () => {
    setError(null);
    setLoading(true);
    try {
      // Fetch room by slug
      const response = await axios.get(
        `${HTTP_BACKEND}/room/${encodeURIComponent(slug.trim())}`
      );

      // backend returns { room: { id, slug, adminId, ... } }
      const roomData = response.data.room;
      if (!roomData || !roomData.id) {
        throw new Error("Room not found");
      }
      setRoomId(String(roomData.id));
    } catch (err) {
      setError(err as unknown as string)
      setError("Failed to find room");
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
    <div className="min-h-screen bg-gradient-to-r from-stone-300 via-lime-100 to-red-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism card */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-2xl p-8">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/10 to-gray-700/10 rounded-3xl blur-xl -z-10"></div>
          
          <div className="relative">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Find & Join Room
            </h2>
            
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="Enter room slug"
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-gray-900 rounded-2xl placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 pointer-events-none"></div>
              </div>
              
              <button
                onClick={handleFind}
                disabled={!slug.trim() || loading}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white hover:text-gray-950 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-violet-500/25"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Finding...</span>
                  </div>
                ) : (
                  "Find Room"
                )}
              </button>
              
              {error && (
                <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              {roomId && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
                    <p className="text-green-200 text-sm">
                      Room ID found: <strong className="text-green-100">{roomId}</strong>
                    </p>
                  </div>
                  
                  <button
                    onClick={handleJoin}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/25"
                  >
                    Join Room
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-violet-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}