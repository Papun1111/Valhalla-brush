"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";
import {
  Plus,
  Users,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function CreateJoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinId, setJoinId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authorization")
          : null;
      if (!token) throw new Error("Authorization token not found");

      const response = await axios.post(
        `${HTTP_BACKEND}/room`,
        { name: roomName.trim() },
        { headers: { authorization: token } }
      );

      const { roomId } = response.data;
      setRoomId(String(roomId));
    } catch (err: unknown) {
      let message = "Failed to create room";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = () => {
    const id = joinId.trim();
    if (id) {
      router.push(`/canvas/${encodeURIComponent(id)}`);
    }
  };

  const handleCopyRoomId = async () => {
    if (roomId) {
      try {
        await navigator.clipboard.writeText(roomId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy room ID:", err);
      }
    }
  };

  const handleStartDrawing = () => {
    if (roomId) {
      router.push(`/canvas/${encodeURIComponent(roomId)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-stone-300 via-lime-100 to-red-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
            Collaborative Canvas
          </h1>
          <p className="text-gray-600 text-sm">
            Create or join a room to start drawing together
          </p>
        </div>

        {!roomId ? (
          /* Create Room Form */
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-200 to-stone-300 rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-stone-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
                  Create New Room
                </h2>
                <p className="text-gray-600 text-sm">
                  Start a new collaborative session
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roomName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room Name
                </label>
                <input
                  id="roomName"
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter a descriptive room name..."
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300/50 
                           text-gray-800 rounded-xl placeholder-gray-500
                           focus:ring-2 focus:ring-stone-400/50 focus:border-stone-400/50
                           transition-all duration-200 outline-none backdrop-blur-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && roomName.trim() && !loading) {
                      handleCreate();
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Choose a name that describes your drawing session
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!roomName.trim() || loading}
                className="w-full py-3 bg-gradient-to-r from-stone-600 to-gray-700 
                         hover:from-stone-500 hover:to-gray-600 
                         disabled:from-gray-400 disabled:to-gray-500
                         disabled:cursor-not-allowed
                         text-white font-medium rounded-xl 
                         transition-all duration-200 
                         focus:ring-2 focus:ring-stone-400/50 outline-none
                         flex items-center justify-center gap-2
                         shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Room...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Room
                  </>
                )}
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-100/80 border border-red-300/50 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 text-red-700 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gray-300/50"></div>
              <span className="text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300/50"></div>
            </div>

            {/* Join Room Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-200 to-lime-300 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-lime-700" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Join Existing Room
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enter a room ID to join
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="joinId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Room ID
                </label>
                <input
                  id="joinId"
                  type="text"
                  value={joinId}
                  onChange={(e) => setJoinId(e.target.value)}
                  placeholder="Paste room ID here..."
                  className="w-full px-4 py-3 bg-white/70 border border-gray-300/50 
                           text-gray-800 rounded-xl placeholder-gray-500
                           focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50
                           transition-all duration-200 outline-none backdrop-blur-sm"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && joinId.trim()) {
                      handleJoin();
                    }
                  }}
                />
              </div>

              <button
                onClick={handleJoin}
                disabled={!joinId.trim()}
                className="w-full py-3 bg-gradient-to-r from-lime-600 to-green-600 
                         hover:from-lime-500 hover:to-green-500 
                         disabled:from-gray-400 disabled:to-gray-500
                         disabled:cursor-not-allowed
                         text-white font-medium rounded-xl 
                         transition-all duration-200 
                         focus:ring-2 focus:ring-lime-400/50 outline-none
                         flex items-center justify-center gap-2
                         shadow-lg hover:shadow-xl"
              >
                <ArrowRight className="w-4 h-4" />
                Join Room
              </button>
            </div>
          </div>
        ) : (
          /* Room Created Success */
          <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-lime-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">
                Room Created Successfully!
              </h2>
              <p className="text-gray-600">
                Your collaborative canvas is ready
              </p>
            </div>

            {/* Room Info */}
            <div className="bg-gray-100/60 rounded-xl p-4 mb-6 border border-gray-200/30 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Room Name
                </span>
                <span className="text-gray-800 font-medium">{roomName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Room ID
                </span>
                <div className="flex items-center gap-2">
                  <code className="bg-white/80 px-2 py-1 rounded text-gray-800 text-sm font-mono border border-gray-200/50">
                    {roomId}
                  </code>
                  <button
                    onClick={handleCopyRoomId}
                    className="p-1 hover:bg-gray-200/50 rounded transition-colors"
                    title="Copy Room ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600 hover:text-gray-800" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleStartDrawing}
                className="w-full py-3 bg-gradient-to-r from-stone-600 to-gray-700 
                         hover:from-stone-500 hover:to-gray-600 
                         text-white font-medium rounded-xl 
                         transition-all duration-200 
                         focus:ring-2 focus:ring-stone-400/50 outline-none
                         flex items-center justify-center gap-2
                         shadow-lg hover:shadow-xl"
              >
                <ArrowRight className="w-4 h-4" />
                Start Drawing
              </button>

              {/* Share Info */}
              <div className="bg-blue-100/80 border border-blue-300/50 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-blue-800 text-sm text-center">
                  Share the Room ID with others to invite them to collaborate
                </p>
              </div>

              {/* Join Another Room */}
              <div className="pt-4 border-t border-gray-300/30">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 text-center">
                    Or join another room
                  </h3>
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    placeholder="Enter room ID to join..."
                    className="w-full px-4 py-2.5 bg-white/70 border border-gray-300/50 
                             text-gray-800 rounded-lg placeholder-gray-500
                             focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400/50
                             transition-all duration-200 outline-none text-sm backdrop-blur-sm"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && joinId.trim()) {
                        handleJoin();
                      }
                    }}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!joinId.trim()}
                    className="w-full py-2.5 bg-gradient-to-r from-lime-600 to-green-600 
                             hover:from-lime-500 hover:to-green-500 
                             disabled:from-gray-400 disabled:to-gray-500
                             disabled:cursor-not-allowed
                             text-white font-medium rounded-lg 
                             transition-all duration-200 
                             focus:ring-2 focus:ring-lime-400/50 outline-none
                             flex items-center justify-center gap-2 text-sm"
                  >
                    <Users className="w-4 h-4" />
                    Join Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            Real-time collaborative drawing • Share ideas visually
          </p>
        </div>
      </div>
    </div>
  );
}