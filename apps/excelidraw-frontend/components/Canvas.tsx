import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, Pencil, Square, Triangle, Minus, Settings, Eraser, Type as TextIcon, X, Info } from "lucide-react";
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
  const [strokeSize, setStrokeSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Handle canvas resizing
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    game?.setColor(selectedColor);
  }, [selectedColor, game]);

  useEffect(() => {
    game?.setStrokeSize(strokeSize);
  }, [strokeSize, game]);

  useEffect(() => {
    game?.setEraserSize(eraserSize);
  }, [eraserSize, game]);

  useEffect(() => {
    if (canvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      return () => g.destroy();
    }
  }, [canvasRef, roomId, socket, canvasSize]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing text
      if (selectedTool === "text") return;
      
      // Don't trigger shortcuts when focused on input elements
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'p':
          setSelectedTool("pencil");
          break;
        case 'r':
          setSelectedTool("rect");
          break;
        case 'c':
          setSelectedTool("circle");
          break;
        case 't':
          setSelectedTool("triangle");
          break;
        case 'l':
          setSelectedTool("line");
          break;
        case 'e':
          setSelectedTool("eraser");
          break;
        case 'x':
          setSelectedTool("text");
          break;
        case 's':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowSettings(!showSettings);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedTool, showSettings]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 cursor-crosshair touch-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          cursor: selectedTool === "eraser" ? "crosshair" : 
                 selectedTool === "text" ? "text" : "crosshair"
        }}
      />

      <Topbar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        showInstructions={showInstructions}
        setShowInstructions={setShowInstructions}
      />

      {showSettings && (
        <ColorPicker
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          setShowSettings={setShowSettings}
          strokeSize={strokeSize}
          setStrokeSize={setStrokeSize}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          selectedTool={selectedTool}
        />
      )}

      {showInstructions && (
        <InstructionsPanel
          setShowInstructions={setShowInstructions}
          selectedTool={selectedTool}
        />
      )}

      {selectedTool === "text" && (
        <TextInstructions />
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
  showInstructions,
  setShowInstructions,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}) {
  const tools = [
    { id: "pencil", icon: Pencil, label: "Pencil (P)", description: "Draw freehand" },
    { id: "rect", icon: Square, label: "Rectangle (R)", description: "Draw rectangles" },
    { id: "circle", icon: Circle, label: "Circle (C)", description: "Draw circles" },
    { id: "triangle", icon: Triangle, label: "Triangle (T)", description: "Draw triangles" },
    { id: "line", icon: Minus, label: "Line (L)", description: "Draw straight lines" },
    { id: "eraser", icon: Eraser, label: "Eraser (E)", description: "Erase drawings" },
    { id: "text", icon: TextIcon, label: "Text (X)", description: "Add text" },
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
                      ? tool.id === "eraser" 
                        ? "rgba(239, 68, 68, 0.8)" 
                        : tool.id === "text"
                        ? "rgba(34, 197, 94, 0.8)"
                        : "rgba(59, 130, 246, 0.8)"
                      : "rgba(30, 41, 59, 0.8)",
                    borderRadius: '12px',
                    padding: '10px 12px',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    border: selectedTool === tool.id 
                      ? tool.id === "eraser"
                        ? '1px solid rgba(239, 68, 68, 0.3)'
                        : tool.id === "text"
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(71, 85, 105, 0.3)',
                    boxShadow: selectedTool === tool.id 
                      ? tool.id === "eraser"
                        ? '0 4px 12px rgba(239, 68, 68, 0.25)'
                        : tool.id === "text"
                        ? '0 4px 12px rgba(34, 197, 94, 0.25)'
                        : '0 4px 12px rgba(59, 130, 246, 0.25)'
                      : '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                              bg-slate-800 text-white text-xs px-2 py-1 rounded-lg
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-10">
                  <div className="font-medium">{tool.label}</div>
                  <div className="text-slate-400">{tool.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-px h-8 bg-slate-600/50 hidden md:block" />

        <div className="flex items-center gap-2">
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
              Settings (Ctrl+S)
            </div>
          </div>

          <div className="relative group">
            <IconButton
              onClick={() => setShowInstructions(!showInstructions)}
              activated={showInstructions}
              icon={<Info className="w-4 h-4 md:w-5 md:h-5" />}
              customStyle={{
                backgroundColor: showInstructions
                  ? "rgba(6, 182, 212, 0.8)"
                  : "rgba(30, 41, 59, 0.8)",
                borderRadius: '12px',
                padding: '10px 12px',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(8px)',
                border: showInstructions 
                  ? '1px solid rgba(6, 182, 212, 0.3)'
                  : '1px solid rgba(71, 85, 105, 0.3)',
                boxShadow: showInstructions 
                  ? '0 4px 12px rgba(6, 182, 212, 0.25)'
                  : '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            />
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 
                          bg-slate-800 text-white text-xs px-2 py-1 rounded-lg
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-10">
              Instructions
            </div>
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
  strokeSize,
  setStrokeSize,
  eraserSize,
  setEraserSize,
  selectedTool,
}: {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  setShowSettings: (show: boolean) => void;
  strokeSize: number;
  setStrokeSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
  selectedTool: Tool;
}) {
  const [customColor, setCustomColor] = useState<string>("#000000");

  return (
    <div className="fixed top-20 left-4 z-40">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 
                      rounded-2xl p-4 shadow-2xl shadow-black/25
                      animate-in slide-in-from-top-2 duration-300 min-w-[280px]">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-sm">Settings</h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-slate-400 hover:text-white transition-colors duration-200
                       w-6 h-6 flex items-center justify-center rounded-lg
                       hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="mb-4">
          <h4 className="text-white text-xs font-medium mb-2">Color Palette</h4>
          <div className="grid grid-cols-6 gap-2 mb-3">
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

        {/* Stroke Size Controls */}
        {selectedTool !== "eraser" && (
          <div className="mb-4 pt-4 border-t border-slate-700/50">
            <h4 className="text-white text-xs font-medium mb-2">Stroke Size</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStrokeSize(Math.max(1, strokeSize - 1))}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 
                          text-white rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-slate-600
                          hover:border-slate-500"
              >
                -
              </button>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={strokeSize}
                  onChange={(e) => setStrokeSize(parseInt(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="text-white text-xs w-8">{strokeSize}px</span>
              </div>
              <button
                onClick={() => setStrokeSize(Math.min(20, strokeSize + 1))}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 
                          text-white rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-slate-600
                          hover:border-slate-500"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex justify-center">
              <div 
                className="rounded-full bg-white"
                style={{ width: `${strokeSize}px`, height: `${strokeSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Eraser Size Controls */}
        {selectedTool === "eraser" && (
          <div className="mb-4 pt-4 border-t border-slate-700/50">
            <h4 className="text-white text-xs font-medium mb-2">Eraser Size</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEraserSize(Math.max(5, eraserSize - 5))}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 
                          text-white rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-slate-600
                          hover:border-slate-500"
              >
                -
              </button>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={eraserSize}
                  onChange={(e) => setEraserSize(parseInt(e.target.value))}
                  className="flex-1 accent-red-500"
                />
                <span className="text-white text-xs w-8">{eraserSize}px</span>
              </div>
              <button
                onClick={() => setEraserSize(Math.min(100, eraserSize + 5))}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 
                          text-white rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-slate-600
                          hover:border-slate-500"
              >
                +
              </button>
            </div>
            <div className="mt-2 flex justify-center">
              <div 
                className="rounded-full border-2 border-dashed border-red-400"
                style={{ width: `${eraserSize}px`, height: `${eraserSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Current Selection Info */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-4 h-4 rounded border border-slate-600" 
                 style={{ backgroundColor: selectedColor }} />
            <span>Color: {selectedColor}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Tool: {selectedTool}</span>
            {selectedTool !== 'eraser' && selectedTool !== 'text' && <span>• Stroke: {strokeSize}px</span>}
            {selectedTool === 'eraser' && <span>• Size: {eraserSize}px</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function InstructionsPanel({
  setShowInstructions,
  selectedTool,
}: {
  setShowInstructions: (show: boolean) => void;
  selectedTool: Tool;
}) {
  const instructions = {
    pencil: "Draw freehand strokes. Hold and drag to draw continuous lines.",
    rect: "Click and drag to draw rectangles. Start from one corner and drag to the opposite corner.",
    circle: "Click and drag to draw circles. The distance determines the radius.",
    triangle: "Click and drag to create triangles. The drag direction determines the shape.",
    line: "Click and drag to draw straight lines between two points.",
    eraser: "Click and drag to erase parts of your drawing. Adjust size in settings.",
    text: "Click anywhere to start typing. Press Enter to confirm, Escape to cancel.",
  };

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 
                      rounded-2xl p-4 shadow-2xl shadow-black/25
                      animate-in slide-in-from-top-2 duration-300">
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium text-sm">Instructions</h3>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-slate-400 hover:text-white transition-colors duration-200
                       w-6 h-6 flex items-center justify-center rounded-lg
                       hover:bg-slate-800/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <h4 className="text-white text-xs font-medium mb-1 capitalize">
              {selectedTool} Tool
            </h4>
            <p className="text-slate-300 text-xs">
              {instructions[selectedTool]}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white text-xs font-medium">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">P</span>
                <span className="text-slate-300">Pencil</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">R</span>
                <span className="text-slate-300">Rectangle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">C</span>
                <span className="text-slate-300">Circle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">T</span>
                <span className="text-slate-300">Triangle</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">L</span>
                <span className="text-slate-300">Line</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">E</span>
                <span className="text-slate-300">Eraser</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">X</span>
                <span className="text-slate-300">Text</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ctrl+S</span>
                <span className="text-slate-300">Settings</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700/30">
            <h4 className="text-blue-300 text-xs font-medium mb-1">Touch Support</h4>
            <p className="text-blue-200 text-xs">
              All tools work with touch on mobile devices. Use single finger gestures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInstructions() {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-green-900/90 backdrop-blur-md border border-green-700/50 
                      rounded-2xl p-3 shadow-2xl shadow-black/25
                      animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center gap-2 text-green-200 text-sm">
          <TextIcon className="w-4 h-4" />
          <span>Click to place text • Enter to confirm • Escape to cancel</span>
        </div>
      </div>
    </div>
  );
}