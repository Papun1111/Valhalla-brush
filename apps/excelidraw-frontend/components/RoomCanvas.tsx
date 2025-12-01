"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authorization") : null;
    
    if (!token) {
      console.error("Authorization token not found in localStorage");
      // Optional: redirect to login here
      return;
    }

    // 1. Initialize WebSocket
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onopen = () => {
      // 2. Once connected, store the socket in state
      setSocket(ws);
      
      // 3. Join the room immediately
      const joinMsg = JSON.stringify({ type: "join_room", roomId });
      ws.send(joinMsg);
      
      console.log(`Connected to room: ${roomId}`);
    };

    ws.onerror = (err) => {
      console.error("WebSocket connection error:", err);
    };

    // 4. Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [roomId]);

  // 5. Show loading state until socket is ready
  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f9fa] text-gray-500 font-mono text-sm">
        Connecting to server...
      </div>
    );
  }

  // 6. Pass the ready socket to the Canvas component
  // The Canvas component (and Game.ts) now handles ALL drawing logic
  return (
    <Canvas roomId={roomId} socket={socket} />
  );
}