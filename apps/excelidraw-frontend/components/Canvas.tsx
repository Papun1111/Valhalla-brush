import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon, Triangle, MinusIcon, Settings } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "triangle" | "line";

const COLORS = [
  "#FFFFFF", // White
  "#FF0000", // Red
  "#00FF00", // Green
  "#0000FF", // Blue
  "#FFFF00", // Yellow
  "#FF00FF", // Magenta
  "#00FFFF", // Cyan
  "#FFA500", // Orange
  "#800080", // Purple
];

export function Canvas({
  roomId,
  socket
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setColor(selectedColor);
  }, [selectedColor, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef,roomId,socket]);

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
      <Topbar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />
      {showSettings && (
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setShowSettings={setShowSettings}
        />
      )}
    </div>
  );
}

function ColorPicker({
  selectedColor,
  setSelectedColor,
  setShowSettings,
}: {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  setShowSettings: (show: boolean) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 70,
        left: 10,
        backgroundColor: "rgba(20, 20, 20, 0.8)",
        padding: "10px",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "5px" }}>
        {COLORS.map((color) => (
          <div
            key={color}
            onClick={() => {
              setSelectedColor(color);
              setShowSettings(false);
            }}
            style={{
              backgroundColor: color,
              width: "30px",
              height: "30px",
              borderRadius: "4px",
              cursor: "pointer",
              border: selectedColor === color ? "2px solid white" : "1px solid #555",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Topbar({
  selectedTool,
  setSelectedTool,
  selectedColor,
  showSettings,
  setShowSettings,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  selectedColor: string;
  setSelectedColor?: (color: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        left: 10,
      }}
    >
      <div className="flex gap-1">
        <IconButton
          onClick={() => {
            setSelectedTool("pencil");
          }}
          activated={selectedTool === "pencil"}
          icon={<Pencil />}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("rect");
          }}
          activated={selectedTool === "rect"}
          icon={<RectangleHorizontalIcon />}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("circle");
          }}
          activated={selectedTool === "circle"}
          icon={<Circle />}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("triangle");
          }}
          activated={selectedTool === "triangle"}
          icon={<Triangle />}
        />
        <IconButton
          onClick={() => {
            setSelectedTool("line");
          }}
          activated={selectedTool === "line"}
          icon={<MinusIcon />}
        />
        <div style={{ width: "8px" }} />
        <IconButton
          onClick={() => {
            setShowSettings(!showSettings);
          }}
          activated={showSettings}
          icon={<Settings />}
          customStyle={{
            backgroundColor: "rgba(30, 30, 30, 0.8)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "16px",
              height: "3px",
              backgroundColor: selectedColor,
              borderRadius: "2px",
            }}
          />
        </IconButton>
      </div>
    </div>
  );
}