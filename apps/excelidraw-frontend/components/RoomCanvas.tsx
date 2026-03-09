"use client";

import { WS_URL } from "@/config";
import { useEffect, useState, useRef, useCallback } from "react";
import { Canvas } from "./Canvas";

type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "failed";

const MAX_RETRIES = 5;

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const retriesRef = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const unmountedRef = useRef(false);

  const connect = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authorization") : null;

    if (!token) {
      console.error("Authorization token not found in localStorage");
      setStatus("failed");
      return;
    }

    if (unmountedRef.current) return;

    const isReconnect = retriesRef.current > 0;
    setStatus(isReconnect ? "reconnecting" : "connecting");

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);

    ws.onopen = () => {
      if (unmountedRef.current) { ws.close(); return; }
      retriesRef.current = 0;
      setSocket(ws);
      setStatus("connected");
      wsRef.current = ws;

      // Join the room
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };

    ws.onerror = () => {
      // Errors are handled by onclose
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      setSocket(null);
      wsRef.current = null;

      if (retriesRef.current < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retriesRef.current), 10000);
        retriesRef.current++;
        setStatus("reconnecting");
        setTimeout(() => {
          if (!unmountedRef.current) connect();
        }, delay);
      } else {
        setStatus("failed");
      }
    };
  }, [roomId]);

  useEffect(() => {
    unmountedRef.current = false;
    connect();

    return () => {
      unmountedRef.current = true;
      wsRef.current?.close();
    };
  }, [connect]);

  const handleRetry = () => {
    retriesRef.current = 0;
    connect();
  };

  // Show loading/status UI until socket is ready
  if (!socket || status !== "connected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0c] text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center gap-6">
          {status === "failed" ? (
            <>
              <div className="w-12 h-12 rounded-full border-2 border-red-500/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-1">Connection Failed</p>
                <p className="text-gray-500 text-xs mb-4">Could not connect to the server</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-[spin_1s_linear_infinite] w-12 h-12"></div>
                <div className="absolute inset-0 rounded-full border-r-2 border-violet-500 animate-[spin_1.5s_linear_infinite] w-12 h-12"></div>
                <div className="w-12 h-12 rounded-full border border-white/10"></div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 font-mono tracking-widest text-sm uppercase animate-pulse">
                  {status === "reconnecting" ? "Reconnecting" : "Connecting"}
                  <span className="text-indigo-400 tracking-normal">...</span>
                </p>
                {status === "reconnecting" && (
                  <p className="text-gray-600 text-xs mt-2">
                    Attempt {retriesRef.current} of {MAX_RETRIES}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return <Canvas roomId={roomId} socket={socket} />;
}