"use client";

import { WS_URL } from "@/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authorization")
        : null;
    if (!token) {
      console.error("Authorization token not found in localStorage");
      return;
    }

    // Initialize WebSocket with dynamic token
    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onopen = () => {
      setSocket(ws);
      // Join the room
      const joinMsg = JSON.stringify({ type: "join_room", roomId });
      ws.send(joinMsg);
      // Initialize drawing on the canvas
      if (canvasRef.current) {
        initDraw(canvasRef.current,roomId,ws);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:\n", err);

    return () => {
      ws.close();
    };
  }, [roomId]);

  if (!socket) {
    return <div>Connecting to server...</div>
  }

  return (
    <Canvas  roomId={roomId} socket={socket} />
  );
}
