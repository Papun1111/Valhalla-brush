import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square, Triangle, Minus, Settings, Eraser, Type as TextIcon, X } from "lucide-react";
import { Game } from "@/draw/Game";

export type Tool = "circle" | "rect" | "pencil" | "triangle" | "line" | "eraser" | "text";

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
  "#000000", // Black
  "#808080", // Gray
  "#FFC0CB", // Pink
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
      return () => g.destroy();
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 cursor-crosshair"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
        }}
      />

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

      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
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
  setSelectedColor: (color: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}) {
  const tools = [
    { id: "pencil", icon: Pencil, label: "Pencil" },
    { id: "rect", icon: Square, label: "Rectangle" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "triangle", icon: Triangle, label: "Triangle" },
    { id: "line", icon: Minus, label: "Line" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
    { id: "text", icon: TextIcon, label: "Text" },
  ];

  return (
    <div className="fixed top-4 left-4 z-30">
      <div className="flex flex-wrap items-center gap-2 md:gap-3 
                      bg-slate-900/80 backdrop-blur-md border border-slate-700/50 
                      rounded-2xl p-2 md:p-3 shadow-2xl shadow-black/25
                      animate-in slide-in-from-top-2 duration-300">
        
        <div className="flex items-center gap-1 md:gap-2">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="relative group">
                <IconButton
                  onClick={() => setSelectedTool(tool.id as Tool)}
                  activated={selectedTool === tool.id}
                  icon={<IconComponent className="w-4 h-4 md:w-5 md:h-5" />}
                  customStyle={{
                    backgroundColor: selectedTool === tool.id
                      ? "rgba(59, 130, 246, 0.8)"
                      : "rgba(30, 41, 59, 0.8)",
                    borderRadius: '12px',
                    padding: '10px 12px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    border: selectedTool === tool.id 
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(71, 85, 105, 0.3)',
                    boxShadow: selectedTool === tool.id 
                      ? '0 4px 12px rgba(59, 130, 246, 0.25)'
                      : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                              bg-slate-800 text-white text-xs px-2 py-1 rounded-lg
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-10">
                  {tool.label}
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-px h-8 bg-slate-600/50 hidden md:block" />

        <div className="relative group">
          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            activated={showSettings}
            icon={<Settings className="w-4 h-4 md:w-5 md:h-5" />}
            customStyle={{
              backgroundColor: showSettings
                ? "rgba(147, 51, 234, 0.8)"
                : "rgba(30, 41, 59, 0.8)",
              borderRadius: '12px',
              padding: '10px 12px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
              border: showSettings 
                ? '1px solid rgba(147, 51, 234, 0.3)'
                : '1px solid rgba(71, 85, 105, 0.3)',
              boxShadow: showSettings 
                ? '0 4px 12px rgba(147, 51, 234, 0.25)'
                : '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                        w-4 h-1 md:w-5 md:h-1 rounded-full"
              style={{ 
                backgroundColor: selectedColor,
                boxShadow: `0 0 4px ${selectedColor}60`
              }}
            />
          </IconButton>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                        bg-slate-800 text-white text-xs px-2 py-1 rounded-lg
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none whitespace-nowrap z-10">
            Colors
          </div>
        </div>
      </div>
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
  const [customColor, setCustomColor] = useState<string>("#000000");

  return (
    <div className="fixed top-20 left-4 z-40">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 
                      rounded-2xl p-4 shadow-2xl shadow-black/25
                      animate-in slide-in-from-top-2 duration-300 min-w-[280px]">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-sm">Color Palette</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-slate-400 hover:text-white transition-colors duration-200
                       w-6 h-6 flex items-center justify-center rounded-lg
                       hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-4">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all duration-200
                         hover:scale-110 hover:shadow-lg
                         ${selectedColor === color 
                           ? 'border-white shadow-lg scale-110' 
                           : 'border-slate-600 hover:border-slate-400'}`}
              style={{ 
                backgroundColor: color,
                boxShadow: selectedColor === color 
                  ? `0 0 12px ${color}60` 
                  : `0 2px 4px ${color}20`
              }}
            />
          ))}
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <label className="text-white text-xs font-medium mb-2 block">
            Custom Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-600 
                        cursor-pointer bg-transparent"
            />
            <button
              onClick={() => setSelectedColor(customColor)}
              className="flex-1 bg-slate-800 hover:bg-slate-700 
                        text-white text-xs px-3 py-2 rounded-lg
                        transition-colors duration-200 border border-slate-600
                        hover:border-slate-500"
            >
              Use Custom Color
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-4 h-4 rounded border border-slate-600" 
                 style={{ backgroundColor: selectedColor }} />
            <span>Selected: {selectedColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}