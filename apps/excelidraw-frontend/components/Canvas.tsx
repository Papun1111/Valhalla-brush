import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import {
  Circle,
  Pencil,
  Square,
  Triangle,
  Minus,
  Settings,
  Eraser,
  Type as TextIcon,
  X,
  Info,
  Download,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { PDFExporter, ExportOptions } from "@/utils/pdfExport";
import { ExportModal } from "./ExportModal";

export type Tool =
  | "circle"
  | "rect"
  | "pencil"
  | "triangle"
  | "line"
  | "eraser"
  | "text";

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
  socket,
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
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Handle canvas resizing
  useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
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
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key.toLowerCase()) {
        case "p":
          setSelectedTool("pencil");
          break;
        case "r":
          setSelectedTool("rect");
          break;
        case "c":
          setSelectedTool("circle");
          break;
        case "t":
          setSelectedTool("triangle");
          break;
        case "l":
          setSelectedTool("line");
          break;
        case "e":
          setSelectedTool("eraser");
          break;
        case "x":
          setSelectedTool("text");
          break;
        case "s":
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) {
              // Ctrl+Shift+S for export
              e.preventDefault();
              setShowExportModal(true);
            } else {
              // Ctrl+S for settings
              e.preventDefault();
              setShowSettings(!showSettings);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedTool, showSettings]);

  // Handle PDF export
  const handleExportToPDF = async (options: ExportOptions = {}) => {
    if (!canvasRef.current) {
      console.error("Canvas not available for export");
      return;
    }

    setIsExporting(true);
    try {
      await PDFExporter.exportHighQualityPDF(canvasRef.current, {
        filename: `drawing-${roomId}-${Date.now()}`,
        includeBackground: true,
        orientation: "landscape",
        ...options,
      });
    } catch (error) {
      console.error("Export failed:", error);
      // You could add a toast notification here
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-r from-red-300 via-rose-600 to-red-900 font-sans">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 cursor-crosshair touch-none"
        style={{
          cursor:
            selectedTool === "eraser"
              ? "crosshair"
              : selectedTool === "text"
                ? "text"
                : "crosshair",
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
        onExport={() => setShowExportModal(true)}
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
          showGrid={showGrid}
          setShowGrid={setShowGrid}
        />
      )}

      {showInstructions && (
        <InstructionsPanel
          setShowInstructions={setShowInstructions}
          selectedTool={selectedTool}
        />
      )}

      {showExportModal && (
        <ExportModal
          onExport={handleExportToPDF}
          onClose={() => setShowExportModal(false)}
          isExporting={isExporting}
        />
      )}

      {selectedTool === "text" && <TextInstructions />}

      {showGrid && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      )}
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
  onExport,
}: {
  selectedTool: Tool;
  setSelectedTool: (s: Tool) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
  onExport: () => void;
}) {
  const tools = [
    {
      id: "pencil",
      icon: Pencil,
      label: "Pencil (P)",
      description: "Draw freehand",
    },
    {
      id: "rect",
      icon: Square,
      label: "Rectangle (R)",
      description: "Draw rectangles",
    },
    {
      id: "circle",
      icon: Circle,
      label: "Circle (C)",
      description: "Draw circles",
    },
    {
      id: "triangle",
      icon: Triangle,
      label: "Triangle (T)",
      description: "Draw triangles",
    },
    {
      id: "line",
      icon: Minus,
      label: "Line (L)",
      description: "Draw straight lines",
    },
    {
      id: "eraser",
      icon: Eraser,
      label: "Eraser (E)",
      description: "Erase drawings",
    },
    { id: "text", icon: TextIcon, label: "Text (X)", description: "Add text" },
  ];

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-30">
      <div
        className="flex flex-wrap items-center gap-1 
                      bg-white/95 backdrop-blur-sm border border-white/30 
                      rounded-xl p-1 shadow-lg
                      animate-in slide-in-from-top-2 duration-300"
      >
        <div className="flex items-center gap-0">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <div key={tool.id} className="relative group">
                <IconButton
                  onClick={() => setSelectedTool(tool.id as Tool)}
                  activated={selectedTool === tool.id}
                  icon={<IconComponent className="w-5 h-5" />}
                  customStyle={{
                    backgroundColor:
                      selectedTool === tool.id
                        ? tool.id === "eraser"
                          ? "rgba(220, 38, 38, 1)"
                          : tool.id === "text"
                            ? "rgba(34, 197, 94, 1)"
                            : "rgba(59, 130, 246, 1)"
                        : "transparent",
                    color: selectedTool === tool.id ? "white" : "#6B7280",
                    borderRadius: "8px",
                    padding: "10px",
                    transition: "all 0.2s ease",
                    border: "none",
                    width: "44px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
                <div
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                              bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-10"
                >
                  <div className="font-medium">{tool.label}</div>
                  <div className="text-gray-300">{tool.description}</div>
                  <div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                w-0 h-0 border-l-2 border-r-2 border-b-2 
                                border-l-transparent border-r-transparent border-b-gray-900"
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <div className="flex items-center gap-0">
          <div className="relative group">
            <IconButton
              onClick={() => setShowSettings(!showSettings)}
              activated={showSettings}
              icon={<Settings className="w-5 h-5" />}
              customStyle={{
                backgroundColor: showSettings
                  ? "rgba(147, 51, 234, 1)"
                  : "transparent",
                color: showSettings ? "white" : "#6B7280",
                borderRadius: "8px",
                padding: "10px",
                transition: "all 0.2s ease",
                border: "none",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                          w-4 h-1 rounded-full border border-gray-200"
                style={{
                  backgroundColor: selectedColor,
                }}
              />
            </IconButton>
            <div
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                          bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-10"
            >
              Settings (Ctrl+S)
            </div>
          </div>

          <div className="relative group">
            <IconButton
              onClick={() => setShowInstructions(!showInstructions)}
              activated={showInstructions}
              icon={<Info className="w-5 h-5" />}
              customStyle={{
                backgroundColor: showInstructions
                  ? "rgba(6, 182, 212, 1)"
                  : "transparent",
                color: showInstructions ? "white" : "#6B7280",
                borderRadius: "8px",
                padding: "10px",
                transition: "all 0.2s ease",
                border: "none",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                          bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-10"
            >
              Instructions
            </div>
          </div>

          <div className="relative group">
            <IconButton
              onClick={onExport}
              activated={false}
              icon={<Download className="w-5 h-5" />}
              customStyle={{
                backgroundColor: "rgba(34, 197, 94, 1)",
                color: "white",
                borderRadius: "8px",
                padding: "10px",
                transition: "all 0.2s ease",
                border: "none",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 
                          bg-gray-900 text-white text-xs px-2 py-1 rounded-md
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200
                          pointer-events-none whitespace-nowrap z-10"
            >
              Export to PDF (Ctrl+Shift+S)
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
  showGrid,
  setShowGrid,
}: {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  setShowSettings: (show: boolean) => void;
  strokeSize: number;
  setStrokeSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
  selectedTool: Tool;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
}) {
  const [customColor, setCustomColor] = useState<string>("#000000");

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <div
        className="bg-white/95 backdrop-blur-sm border border-white/30 
                      rounded-xl p-4 shadow-lg
                      animate-in slide-in-from-top-2 duration-300 min-w-[320px]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-semibold text-base tracking-tight">
            Settings
          </h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200
                       w-6 h-6 flex items-center justify-center rounded-lg
                       hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="mb-4">
          <h4 className="text-gray-700 text-sm font-semibold mb-3 tracking-tight">
            Color Palette
          </h4>
          <div className="grid grid-cols-6 gap-2 mb-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200
                           hover:scale-110 hover:shadow-md
                           ${
                             selectedColor === color
                               ? "border-blue-500 shadow-md scale-110"
                               : "border-gray-300 hover:border-gray-400"
                           }`}
                style={{
                  backgroundColor: color,
                  boxShadow:
                    selectedColor === color ? `0 0 8px ${color}40` : "none",
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-8 h-8 rounded-lg border border-gray-300 
                        cursor-pointer bg-transparent"
            />
            <button
              onClick={() => setSelectedColor(customColor)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 
                        text-gray-800 text-sm px-3 py-2 rounded-lg
                        transition-colors duration-200 border border-gray-200
                        hover:border-gray-300"
            >
              Use Custom Color
            </button>
          </div>
        </div>

        {/* Grid Toggle */}
        <div className="mb-4 pt-4 border-t border-gray-200">
          <h4 className="text-gray-700 text-sm font-semibold mb-3 tracking-tight">
            Canvas Options
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 text-sm font-medium">Show Grid</span>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none
                ${showGrid ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                  ${showGrid ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        {/* Stroke Size Controls */}
        {selectedTool !== "eraser" && (
          <div className="mb-4 pt-4 border-t border-gray-200">
            <h4 className="text-gray-700 text-sm font-semibold mb-3 tracking-tight">
              Stroke Size
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStrokeSize(Math.max(1, strokeSize - 1))}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 
                          text-gray-700 rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-gray-200
                          hover:border-gray-300 font-medium"
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
                <span className="text-gray-700 text-sm font-medium w-10 text-center">
                  {strokeSize}px
                </span>
              </div>
              <button
                onClick={() => setStrokeSize(Math.min(20, strokeSize + 1))}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 
                          text-gray-700 rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-gray-200
                          hover:border-gray-300 font-medium"
              >
                +
              </button>
            </div>
            <div className="mt-3 flex justify-center">
              <div
                className="rounded-full bg-gray-800"
                style={{ width: `${strokeSize}px`, height: `${strokeSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Eraser Size Controls */}
        {selectedTool === "eraser" && (
          <div className="mb-4 pt-4 border-t border-gray-200">
            <h4 className="text-gray-700 text-sm font-semibold mb-3 tracking-tight">
              Eraser Size
            </h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEraserSize(Math.max(5, eraserSize - 5))}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 
                          text-gray-700 rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-gray-200
                          hover:border-gray-300 font-medium"
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
                <span className="text-gray-700 text-sm font-medium w-10 text-center">
                  {eraserSize}px
                </span>
              </div>
              <button
                onClick={() => setEraserSize(Math.min(100, eraserSize + 5))}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 
                          text-gray-700 rounded-lg transition-colors duration-200
                          flex items-center justify-center border border-gray-200
                          hover:border-gray-300 font-medium"
              >
                +
              </button>
            </div>
            <div className="mt-3 flex justify-center">
              <div
                className="rounded-full border-2 border-dashed border-red-500"
                style={{ width: `${eraserSize}px`, height: `${eraserSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Current Selection Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: selectedColor }}
            />
            <span>
              Color: <span className="font-mono text-xs">{selectedColor}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 font-medium">
            <span>
              Tool:{" "}
              <span className="capitalize font-semibold text-gray-800">
                {selectedTool}
              </span>
            </span>
            {selectedTool !== "eraser" && selectedTool !== "text" && (
              <span>
                • Stroke: <span className="font-mono">{strokeSize}px</span>
              </span>
            )}
            {selectedTool === "eraser" && (
              <span>
                • Size: <span className="font-mono">{eraserSize}px</span>
              </span>
            )}
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
    circle:
      "Click and drag to draw circles. The distance determines the radius.",
    triangle:
      "Click and drag to create triangles. The drag direction determines the shape.",
    line: "Click and drag to draw straight lines between two points.",
    eraser:
      "Click and drag to erase parts of your drawing. Adjust size in settings.",
    text: "Click anywhere to start typing. Press Enter to confirm, Escape to cancel.",
  };

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm">
      <div
        className="bg-white/95 backdrop-blur-sm border border-white/30 
                      rounded-xl p-4 shadow-lg
                      animate-in slide-in-from-top-2 duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-semibold text-base tracking-tight">
            Instructions
          </h3>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200
                       w-6 h-6 flex items-center justify-center rounded-lg
                       hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-gray-900 text-sm font-semibold mb-1 capitalize tracking-tight">
              {selectedTool} Tool
            </h4>
            <p className="text-gray-700 text-sm">
              {instructions[selectedTool]}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-gray-900 text-sm font-semibold tracking-tight">
              Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-1 gap-1 text-sm font-medium">
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  P
                </span>
                <span className="text-gray-700">Pencil</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  R
                </span>
                <span className="text-gray-700">Rectangle</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  C
                </span>
                <span className="text-gray-700">Circle</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  T
                </span>
                <span className="text-gray-700">Triangle</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  L
                </span>
                <span className="text-gray-700">Line</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  E
                </span>
                <span className="text-gray-700">Eraser</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  X
                </span>
                <span className="text-gray-700">Text</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  Ctrl+S
                </span>
                <span className="text-gray-700">Settings</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  Ctrl+Shift+S
                </span>
                <span className="text-gray-700">Export PDF</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <h4 className="text-green-800 text-sm font-semibold mb-1 tracking-tight">
              Touch Support
            </h4>
            <p className="text-green-700 text-sm">
              All tools work with touch on mobile devices. Use single finger
              gestures.
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
      <div
        className="bg-white/95 backdrop-blur-sm border border-white/30 
                      rounded-xl p-3 shadow-lg
                      animate-in slide-in-from-bottom-2 duration-300"
      >
        <div className="flex items-center gap-2 text-gray-700 text-sm font-medium">
          <TextIcon className="w-4 h-4" />
          <span>
            Click to place text •{" "}
            <kbd className="bg-gray-100 px-1 rounded text-xs">Enter</kbd> to
            confirm •{" "}
            <kbd className="bg-gray-100 px-1 rounded text-xs">Escape</kbd> to
            cancel
          </span>
        </div>
      </div>
    </div>
  );
}