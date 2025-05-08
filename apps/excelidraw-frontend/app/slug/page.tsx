"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        `http://localhost:8080/room/${encodeURIComponent(slug.trim())}`
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Find and Join Room</h2>
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Enter room slug"
        className="w-full px-4 py-2 mb-4 bg-gray-700 text-gray-100 rounded-lg placeholder-gray-400"
      />
      <button
        onClick={handleFind}
        disabled={!slug.trim() || loading}
        className="w-full mb-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition"
      >
        {loading ? "Finding..." : "Find Room"}
      </button>
      {error && <p className="mb-4 text-red-500">{error}</p>}

      {roomId && (
        <>
          <p className="text-indigo-300 mb-2">
            Room ID found: <strong>{roomId}</strong>
          </p>
          <button
            onClick={handleJoin}
            className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition"
          >
            Join Room
          </button>
        </>
      )}
    </div>
  );
}
