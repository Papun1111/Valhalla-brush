"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJoinRoom() {
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinId, setJoinId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    setError(null);
    setLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authorization") : null;
      if (!token) throw new Error("Authorization token not found");

      const response = await axios.post(
        "http://localhost:8080/room",
        { name: roomName.trim() },
        { headers: { authorization: token } }
      );

      const { roomId } = response.data;
      setRoomId(String(roomId));
    } catch (err: unknown) {
      let message = 'Failed to create room';
    
      if (axios.isAxiosError(err)) {
        // err is an AxiosError
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        // any other JS Error
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

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-2xl shadow-lg">
      {!roomId ? (
        <>
          <h2 className="text-2xl font-bold text-white mb-4">Create a New Room</h2>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name"
            className="w-full px-4 py-2 mb-4 bg-gray-700 text-gray-100 rounded-lg placeholder-gray-400"
          />
          <button
            onClick={handleCreate}
            disabled={!roomName.trim() || loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-white mb-2">Room Created!</h2>
          <p className="text-indigo-300 mb-4">
            Your room ID: <strong>{roomId}</strong>
          </p>
          <input
            type="text"
            value={joinId}
            onChange={(e) => setJoinId(e.target.value)}
            placeholder="Enter room ID to join"
            className="w-full px-4 py-2 mb-4 bg-gray-700 text-gray-100 rounded-lg placeholder-gray-400"
          />
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