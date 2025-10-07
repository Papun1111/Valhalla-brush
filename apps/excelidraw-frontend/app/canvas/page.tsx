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
            <span className="uppercase">Collaborative Space</span>
          </div>
          <h1 className="text-4xl font-light text-stone-900 mb-3 leading-tight">
            {!roomId ? (
              <>Create or join<br /><span className="font-serif italic">your room</span></>
            ) : (
              <>Room is<br /><span className="font-serif italic">ready</span></>
            )}
          </h1>
          <p className="text-stone-600 text-sm">
            {!roomId 
              ? "Start a new session or join an existing collaborative canvas"
              : "Your collaborative canvas is ready to use"
            }
          </p>
        </div>

        {!roomId ? (
          /* Create Room Form */
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              {/* Create Room Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-stone-900 rounded-lg">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-medium text-stone-900">
                    Create New Room
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="roomName"
                      className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2"
                    >
                      Room Name
                    </label>
                    <input
                      id="roomName"
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 
                               text-stone-900 rounded-lg placeholder-stone-400
                               focus:ring-2 focus:ring-stone-400 focus:border-transparent
                               transition-all duration-200 outline-none"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && roomName.trim() && !loading) {
                          handleCreate();
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={handleCreate}
                    disabled={!roomName.trim() || loading}
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
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create Room</span>
                      </>
                    )}
                  </button>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-stone-200"></div>
                <span className="text-stone-500 text-xs uppercase tracking-wide font-medium">Or</span>
                <div className="flex-1 h-px bg-stone-200"></div>
              </div>

              {/* Join Room Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-stone-100 border border-stone-300 rounded-lg">
                    <Users className="w-4 h-4 text-stone-700" />
                  </div>
                  <h3 className="text-lg font-medium text-stone-900">
                    Join Existing Room
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="joinId"
                      className="block text-xs uppercase tracking-wide font-medium text-stone-700 mb-2"
                    >
                      Room ID
                    </label>
                    <input
                      id="joinId"
                      type="text"
                      value={joinId}
                      onChange={(e) => setJoinId(e.target.value)}
                      placeholder="Paste room ID"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-300 
                               text-stone-900 rounded-lg placeholder-stone-400
                               focus:ring-2 focus:ring-stone-400 focus:border-transparent
                               transition-all duration-200 outline-none"
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
                    className="w-full py-3 bg-white border-2 border-stone-900 
                             hover:bg-stone-900 hover:text-white
                             disabled:border-stone-300 disabled:text-stone-400
                             disabled:cursor-not-allowed
                             text-stone-900 font-medium rounded-lg 
                             transition-all duration-200 
                             focus:ring-2 focus:ring-stone-400 outline-none
                             flex items-center justify-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Join Room</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Room Created Success */
          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-light text-stone-900 mb-2">
                Room Created
              </h2>
              <p className="text-stone-600 text-sm">
                Share the ID to invite collaborators
              </p>
            </div>

            {/* Room Info */}
            <div className="bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs uppercase tracking-wide font-medium text-stone-600">
                  Room Name
                </span>
                <span className="text-stone-900 font-medium">{roomName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide font-medium text-stone-600">
                  Room ID
                </span>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-1.5 rounded text-stone-900 text-sm font-mono border border-stone-200">
                    {roomId}
                  </code>
                  <button
                    onClick={handleCopyRoomId}
                    className="p-2 hover:bg-stone-200 rounded-lg transition-colors"
                    title="Copy Room ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-stone-900" />
                    ) : (
                      <Copy className="w-4 h-4 text-stone-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleStartDrawing}
                className="w-full py-3 bg-stone-900 hover:bg-stone-800
                         text-white font-medium rounded-lg 
                         transition-all duration-200 
                         focus:ring-2 focus:ring-stone-400 outline-none
                         flex items-center justify-center gap-2 shadow-lg"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Start Drawing</span>
              </button>

              {/* Share Info */}
              <div className="bg-stone-100 border border-stone-200 rounded-lg p-3">
                <p className="text-stone-700 text-xs text-center">
                  Share the Room ID with others to invite them
                </p>
              </div>

              {/* Join Another Room */}
              <div className="pt-4 border-t border-stone-200">
                <p className="text-xs uppercase tracking-wide font-medium text-stone-600 text-center mb-3">
                  Join Another Room
                </p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => setJoinId(e.target.value)}
                    placeholder="Enter room ID"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 
                             text-stone-900 rounded-lg placeholder-stone-400 text-sm
                             focus:ring-2 focus:ring-stone-400 focus:border-transparent
                             transition-all duration-200 outline-none"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && joinId.trim()) {
                        handleJoin();
                      }
                    }}
                  />
                  <button
                    onClick={handleJoin}
                    disabled={!joinId.trim()}
                    className="w-full py-2.5 bg-white border-2 border-stone-900
                             hover:bg-stone-900 hover:text-white
                             disabled:border-stone-300 disabled:text-stone-400
                             disabled:cursor-not-allowed
                             text-stone-900 font-medium rounded-lg 
                             transition-all duration-200 
                             focus:ring-2 focus:ring-stone-400 outline-none
                             flex items-center justify-center gap-2 text-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>Join</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-stone-500 text-xs">
            Real-time collaborative drawing
          </p>
        </div>
      </div>
    </div>
  );
}