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
  Grid3X3,
  Palette,
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
  "#000000", // Black (First for aesthetic default)
  "#343a40", // Dark Gray
  "#495057", // Gray
  "#c92a2a", // Red
  "#a61e4d", // Pink
  "#862e9c", // Grape
  "#5f3dc4", // Violet
  "#364fc7", // Indigo
  "#1864ab", // Blue
  "#0b7285", // Cyan
  "#087f5b", // Teal
  "#2b8a3e", // Green
  "#5c940d", // Lime
  "#e67700", // Orange
  "#d9480f", // Orange Red
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
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f8f9fa] font-sans text-slate-900 selection:bg-purple-100">
      {/* Grid Background */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="w-full h-full opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 cursor-crosshair touch-none z-10"
        style={{
          cursor:
            selectedTool === "eraser"
              ? "crosshair"
              : selectedTool === "text"
                ? "text"
                : "crosshair",
        }}
      />

      {/* Top Navigation Bar */}
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

      {/* Floating Settings Panel (Left Side like Properties) */}
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

      {/* Floating Instructions Panel (Right Side) */}
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

      {/* Bottom Toast for Text Tool */}
      {selectedTool === "text" && <TextInstructions />}

      {/* Branding/Watermark (Optional aesthetic touch) */}
      <div className="fixed bottom-4 right-4 z-0 pointer-events-none opacity-30 select-none">
        <span className="font-handwriting text-sm font-bold">Valhalla Canvas</span>
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
      label: "Draw",
      shortcut: "P",
    },
    {
      id: "rect",
      icon: Square,
      label: "Rectangle",
      shortcut: "R",
    },
    {
      id: "circle",
      icon: Circle,
      label: "Circle",
      shortcut: "C",
    },
    {
      id: "triangle",
      icon: Triangle,
      label: "Triangle",
      shortcut: "T",
    },
    {
      id: "line",
      icon: Minus,
      label: "Line",
      shortcut: "L",
    },
    {
      id: "text",
      icon: TextIcon,
      label: "Text",
      shortcut: "X",
    },
    {
      id: "eraser",
      icon: Eraser,
      label: "Eraser",
      shortcut: "E",
    },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div
        className="flex items-center gap-3 
                      bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-200 
                      rounded-xl p-1.5
                      animate-in slide-in-from-top-4 duration-300"
      >
        {/* Tools Section */}
        <div className="flex items-center gap-1 px-1">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = selectedTool === tool.id;
            
            return (
              <div key={tool.id} className="relative group">
                <IconButton
                  onClick={() => setSelectedTool(tool.id as Tool)}
                  activated={isActive}
                  icon={<IconComponent className="w-4 h-4" />}
                  customStyle={{
                    backgroundColor: isActive ? "#e0e7ff" : "transparent", // Soft indigo for active
                    color: isActive ? "#4338ca" : "#4b5563", // Indigo-700 vs Gray-600
                    borderRadius: "8px",
                    padding: "8px",
                    border: "none",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: isActive ? "inset 0 0 0 1px #c7d2fe" : "none",
                  }}
                />
                {/* Tooltip */}
                <div
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 
                              bg-gray-900 text-white text-[10px] px-2 py-1 rounded
                              opacity-0 group-hover:opacity-100 transition-opacity duration-200
                              pointer-events-none whitespace-nowrap z-50 tracking-wide shadow-xl"
                >
                   {tool.label} <span className="opacity-60 ml-1">({tool.shortcut})</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Actions Section */}
        <div className="flex items-center gap-1 px-1">
          {/* Settings Toggle */}
          <div className="relative group">
            <IconButton
              onClick={() => setShowSettings(!showSettings)}
              activated={showSettings}
              icon={<Settings className="w-4 h-4" />}
              customStyle={{
                backgroundColor: showSettings ? "#f3e8ff" : "transparent",
                color: showSettings ? "#7e22ce" : "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                border: "none",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                          w-1 h-1 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
            </IconButton>
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">Properties</div>
          </div>

          {/* Instructions */}
          <div className="relative group">
            <IconButton
              onClick={() => setShowInstructions(!showInstructions)}
              activated={showInstructions}
              icon={<Info className="w-4 h-4" />}
              customStyle={{
                backgroundColor: showInstructions ? "#ecfeff" : "transparent",
                color: showInstructions ? "#0e7490" : "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                border: "none",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
             <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">Help</div>
          </div>

          {/* Export */}
          <div className="relative group">
            <IconButton
              onClick={onExport}
              activated={false}
              icon={<Download className="w-4 h-4" />}
              customStyle={{
                backgroundColor: "transparent",
                color: "#4b5563",
                borderRadius: "8px",
                padding: "8px",
                border: "none",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">Export</div>
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
    <div className="fixed top-20 left-4 z-40">
      <div
        className="bg-white shadow-[0_5px_20px_rgba(0,0,0,0.1)] border border-gray-200 
                      rounded-xl p-4
                      animate-in slide-in-from-left-4 duration-300 w-[240px]"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3 h-3" /> Stroke Properties
          </h3>
          <button
            onClick={() => setShowSettings(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="mb-5">
          <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2">
            Stroke Color
          </h4>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-5 h-5 rounded-full transition-all duration-200
                           hover:scale-110 relative
                           ${
                             selectedColor === color
                               ? "ring-2 ring-offset-1 ring-gray-900 scale-110 z-10"
                               : "ring-1 ring-black/5 hover:ring-black/20"
                           }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden ring-1 ring-black/10">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
              />
            </div>
             <button
              onClick={() => setSelectedColor(customColor)}
              className="text-[10px] font-medium text-gray-600 hover:text-gray-900 underline decoration-gray-300 underline-offset-2"
            >
              Custom Hex
            </button>
          </div>
        </div>

        {/* Stroke Size Controls */}
        {selectedTool !== "eraser" && (
          <div className="mb-5">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2">
              Stroke Width
            </h4>
            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
               <span className="text-[10px] text-gray-400 font-mono w-4">1</span>
              <input
                type="range"
                min="1"
                max="20"
                value={strokeSize}
                onChange={(e) => setStrokeSize(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
              <span className="text-[10px] text-gray-400 font-mono w-4">20</span>
            </div>
             <div className="mt-2 flex justify-center items-center h-6">
              <div
                className="rounded-full bg-black"
                style={{ width: `${strokeSize}px`, height: `${strokeSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Eraser Size Controls */}
        {selectedTool === "eraser" && (
          <div className="mb-5">
            <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2">
              Eraser Size
            </h4>
             <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100">
              <span className="text-[10px] text-gray-400 font-mono w-4">5</span>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={eraserSize}
                onChange={(e) => setEraserSize(parseInt(e.target.value))}
                 className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
               <span className="text-[10px] text-gray-400 font-mono w-4">100</span>
            </div>
            <div className="mt-2 flex justify-center items-center h-12">
               <div
                className="rounded-full border border-dashed border-gray-400 bg-gray-100"
                style={{ width: `${eraserSize}px`, height: `${eraserSize}px` }}
              />
            </div>
          </div>
        )}

        {/* Grid Toggle */}
        <div className="pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Grid3X3 className={`w-4 h-4 ${showGrid ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className="text-xs font-medium text-gray-700">Background Grid</span>
            </div>
            <div className={`w-2 h-2 rounded-full ${showGrid ? 'bg-purple-500' : 'bg-gray-200'}`} />
          </button>
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
  return (
    <div className="fixed top-20 right-4 z-40 w-[280px]">
      <div
        className="bg-white shadow-[0_5px_20px_rgba(0,0,0,0.1)] border border-gray-200 
                      rounded-xl p-5
                      animate-in slide-in-from-right-4 duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-wider">
            Quick Help
          </h3>
          <button
            onClick={() => setShowInstructions(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600 leading-relaxed">
             Currently using: <span className="font-semibold text-gray-900 capitalize bg-gray-100 px-1 rounded">{selectedTool}</span>
          </div>

          <div>
            <h4 className="text-gray-500 text-[10px] font-bold uppercase mb-2">
              Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2">
               {[
                 {k: 'P', l: 'Pencil'},
                 {k: 'R', l: 'Rectangle'},
                 {k: 'C', l: 'Circle'},
                 {k: 'L', l: 'Line'},
                 {k: 'T', l: 'Triangle'},
                 {k: 'E', l: 'Eraser'},
                 {k: 'X', l: 'Text'},
               ].map(item => (
                 <div key={item.k} className="flex items-center justify-between text-xs group hover:bg-gray-50 p-1 rounded cursor-default">
                   <span className="text-gray-600">{item.l}</span>
                   <kbd className="font-mono text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 min-w-[20px] text-center">{item.k}</kbd>
                 </div>
               ))}
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
             <div className="flex items-center justify-between text-xs">
                   <span className="text-gray-600">Export PDF</span>
                   <kbd className="font-mono text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">Ctrl + Shift + S</kbd>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInstructions() {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-2 
                      rounded-full shadow-lg flex items-center gap-4
                      animate-in slide-in-from-bottom-2 duration-300"
      >
        <span className="text-xs font-medium flex items-center gap-2">
          <TextIcon className="w-3 h-3 text-green-400" />
          Click to start typing
        </span>
        <div className="h-3 w-px bg-gray-700" />
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-gray-400"><kbd className="bg-gray-800 px-1 rounded">Enter</kbd> to save</span>
           <span className="text-[10px] text-gray-400"><kbd className="bg-gray-800 px-1 rounded">Esc</kbd> to cancel</span>
        </div>
      </div>
    </div>
  );
}