/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Pencil,
  Square,
  Triangle,
  Minus,
  Eraser,
  Type as TextIcon,
  X,
  Menu,
  MousePointer2,
  Lock,
  Hand,
  Image as ImageIcon,
  HelpCircle,
  Palette,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Undo2,
  Redo2,
  Moon,
  Grid3X3,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { PDFExporter, ExportOptions } from "@/utils/pdfExport";
import { ExportModal } from "./ExportModal";

// --- Types & Constants ---

export type Tool =
  | "circle"
  | "rect"
  | "pencil"
  | "triangle"
  | "line"
  | "eraser"
  | "text"
  | "hand";

const COLORS = [
  "#000000",
  "#343a40",
  "#495057",
  "#c92a2a",
  "#a61e4d",
  "#862e9c",
  "#5f3dc4",
  "#364fc7",
  "#1864ab",
  "#0b7285",
  "#087f5b",
  "#2b8a3e",
  "#5c940d",
  "#e67700",
  "#d9480f",
];

// --- Main Canvas Component ---

export function Canvas({
  roomId,
  socket,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  
  // State
  const [selectedTool, setSelectedTool] = useState<Tool>("circle");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [strokeSize, setStrokeSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(1); // UI State for Zoom %

  // UI Toggles
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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

  // Sync React State -> Game Class
  useEffect(() => { game?.setTool(selectedTool); }, [selectedTool, game]);
  useEffect(() => { game?.setColor(selectedColor); }, [selectedColor, game]);
  useEffect(() => { game?.setStrokeSize(strokeSize); }, [strokeSize, game]);
  useEffect(() => { game?.setEraserSize(eraserSize); }, [eraserSize, game]);
  useEffect(() => { game?.setShowGrid(showGrid); }, [showGrid, game]);

  // Initialize Game
  useEffect(() => {
    if (canvasRef.current && canvasSize.width > 0 && canvasSize.height > 0) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);
      // Initialize zoom state from game default
      setZoom(g.getZoom());
      return () => g.destroy();
    }
  }, [canvasRef, roomId, socket, canvasSize]);

  // ==========================================
  // === CRITICAL: REAL-TIME SOCKET LISTENER ===
  // ==========================================
  useEffect(() => {
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
            const parsedMessage = JSON.parse(message.message);
            // If we receive a shape, tell the game instance to add it
            if (parsedMessage && parsedMessage.shape) {
                 game?.addShape(parsedMessage.shape);
            }
        }
      } catch (e) {
        console.error("Error parsing socket message:", e);
      }
    };

    // Cleanup on unmount
    return () => {
        socket.onmessage = null;
    };
  }, [socket, game]); // Re-binds when game instance updates
  // ==========================================

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedTool === "text") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();
      
      // Tools
      if (key === "p") setSelectedTool("pencil");
      else if (key === "r") setSelectedTool("rect");
      else if (key === "c") setSelectedTool("circle");
      else if (key === "t") setSelectedTool("triangle");
      else if (key === "l") setSelectedTool("line");
      else if (key === "e") setSelectedTool("eraser");
      else if (key === "x") setSelectedTool("text");
      else if (key === "h") setSelectedTool("hand");
      
      // Actions
      else if (key === "z" && (e.ctrlKey || e.metaKey)) {
         if (e.shiftKey) game?.redo();
         else game?.undo();
         e.preventDefault();
      }
      else if (key === "y" && (e.ctrlKey || e.metaKey)) {
         game?.redo();
         e.preventDefault();
      }
      else if (key === "s" && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          e.preventDefault();
          setShowExportModal(true);
        } else {
          e.preventDefault();
          setShowSettings(!showSettings);
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedTool, showSettings, game]);

  // Listen for Mouse Wheel events on canvas to update UI Zoom %
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;

    const updateZoomState = () => {
        // We delay slightly to let the game engine process the wheel event first
        requestAnimationFrame(() => setZoom(game.getZoom()));
    };

    canvas.addEventListener('wheel', updateZoomState);
    return () => canvas.removeEventListener('wheel', updateZoomState);
  }, [game]);

  // --- Handlers ---

  const onZoomIn = () => {
      const newZoom = (game?.getZoom() || 1) + 0.1;
      game?.setZoom(newZoom);
      setZoom(newZoom);
  };

  const onZoomOut = () => {
      const newZoom = (game?.getZoom() || 1) - 0.1;
      game?.setZoom(newZoom);
      setZoom(newZoom);
  };

  const onUndo = () => game?.undo();
  const onRedo = () => game?.redo();

  const handleExportToPDF = async (options: ExportOptions = {}) => {
    if (!canvasRef.current) return;
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
    <div className="relative h-screen w-full overflow-hidden bg-[#f8f9fa] font-sans text-slate-900">
      
      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 z-10 touch-none"
        style={{
          cursor:
             selectedTool === "hand" ? "grab" :
             selectedTool === "text" ? "text" : "crosshair",
        }}
      />

      {/* --- UI LAYER --- */}
      
      <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

      <SidebarMenu 
        onExport={() => setShowExportModal(true)}
        onToggleHelp={() => setShowInstructions(!showInstructions)}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {showSettings && (
        <PropertiesPanel
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          strokeSize={strokeSize}
          setStrokeSize={setStrokeSize}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
          selectedTool={selectedTool}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
        />
      )}

      {/* Header Buttons */}
      <div className="fixed top-4 right-4 z-30 flex gap-2">
         <button className="h-9 px-3 bg-[#e0dfff] hover:bg-[#d0cfff] text-[#5b5bd6] rounded-lg text-xs font-bold transition-colors">
            Valhalla Brush
         </button>

      </div>

      {/* Footer Controls (Functional Now) */}
      <BottomControls 
         zoom={zoom}
         onZoomIn={onZoomIn}
         onZoomOut={onZoomOut}
         onUndo={onUndo}
         onRedo={onRedo}
      />

      {selectedTool === "text" && <TextInstructions />}

      {/* Modals */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
      
      {showExportModal && (
        <ExportModal
          onExport={handleExportToPDF}
          onClose={() => setShowExportModal(false)}
          isExporting={isExporting}
        />
      )}
    </div>
  );
}

// --- Sub-Components ---

function ToolBar({ selectedTool, setSelectedTool }: { selectedTool: Tool; setSelectedTool: (t: Tool) => void }) {
  const tools = [
    { id: "lock", icon: Lock, label: "Keep selected tool active", disabled: true },
    { id: "hand", icon: Hand, label: "Hand (Panning)", disabled: false }, // Enabled Hand
    { id: "selection", icon: MousePointer2, label: "Selection", disabled: true },
    { id: "rect", icon: Square, label: "Rectangle (R)" },
    { id: "triangle", icon: Triangle, label: "Triangle (T)" },
    { id: "circle", icon: Circle, label: "Circle (C)" },
    { id: "line", icon: Minus, label: "Line (L)" },
    { id: "pencil", icon: Pencil, label: "Draw (P)" },
    { id: "text", icon: TextIcon, label: "Text (X)" },
    { id: "image", icon: ImageIcon, label: "Insert Image", disabled: true },
    { id: "eraser", icon: Eraser, label: "Eraser (E)" },
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex items-center gap-1 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-gray-200 rounded-lg p-1">
        {tools.map((tool) => {
          const isActive = selectedTool === tool.id;
          const Icon = tool.icon;
          
          if (tool.disabled) {
             return (
               <div key={tool.id} className="p-2 text-gray-300 cursor-not-allowed">
                 <Icon className="w-4 h-4" />
               </div>
             )
          }

          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as Tool)}
              className={`
                relative group p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-[#e0dfff] text-[#5b5bd6]" 
                  : "hover:bg-gray-100 text-gray-700"
                }
              `}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
              <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SidebarMenu({ onExport, onToggleHelp, showSettings, setShowSettings }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-40 flex flex-col gap-3">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-sm border border-gray-200 text-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
             <div className="py-1">
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canvas</div>
                <button 
                  onClick={() => { setShowSettings(!showSettings); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center"
                >
                   <span>Properties</span>
                   <Palette className="w-4 h-4 opacity-50" />
                </button>
                <button 
                  onClick={() => { onExport(); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center"
                >
                   <span>Export image...</span>
                   <span className="text-[10px] text-gray-400">Shift+Ctrl+S</span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button 
                  onClick={() => { onToggleHelp(); setIsOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center"
                >
                   <span>Help</span>
                   <HelpCircle className="w-4 h-4 opacity-50" />
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertiesPanel({
  selectedColor,
  setSelectedColor,
  strokeSize,
  setStrokeSize,
  eraserSize,
  setEraserSize,
  selectedTool,
  showGrid,
  setShowGrid,
}: any) {
  const [customColor, setCustomColor] = useState<string>("#000000");

  return (
    <div className="fixed top-20 left-4 z-30 w-[220px]">
      <div className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-gray-200 rounded-lg p-3 space-y-5 overflow-y-auto max-h-[80vh]">
        
        {/* Stroke Section */}
        <div>
           <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] font-bold text-gray-800">Stroke</label>
           </div>
           
           <div className="grid grid-cols-5 gap-1.5 mb-3">
             {COLORS.slice(0, 10).map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-[4px] border transition-transform hover:scale-105 ${selectedColor === c ? "border-gray-900 ring-1 ring-gray-900 z-10" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                  aria-label={c}
                />
             ))}
             <div className="relative w-7 h-7 rounded-[4px] overflow-hidden border border-gray-200">
               <input 
                 type="color" 
                 value={customColor} 
                 onChange={(e) => { setCustomColor(e.target.value); setSelectedColor(e.target.value); }}
                 className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
               />
             </div>
           </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Width Section */}
        {selectedTool !== "eraser" ? (
          <div>
            <label className="text-[11px] font-bold text-gray-800 mb-2 block">Stroke width</label>
            <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-md mb-2">
               {[2, 4, 6, 8].map(size => (
                  <button 
                    key={size}
                    onClick={() => setStrokeSize(size)}
                    className={`flex-1 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors ${strokeSize === size ? "bg-[#e0dfff] hover:bg-[#e0dfff]" : ""}`}
                  >
                     <div className={`bg-black rounded-full ${strokeSize === size ? "opacity-100" : "opacity-60"}`} style={{ height: Math.min(size * 1.5, 12), width: '20px' }} />
                  </button>
               ))}
            </div>
            <input
              type="range"
              min="1" max="20"
              value={strokeSize}
              onChange={(e) => setStrokeSize(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b5bd6]"
            />
          </div>
        ) : (
          <div>
             <label className="text-[11px] font-bold text-gray-800 mb-2 block">Eraser width</label>
             <input
              type="range"
              min="5" max="50"
              value={eraserSize}
              onChange={(e) => setEraserSize(parseInt(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b5bd6]"
            />
          </div>
        )}

        <div className="h-px bg-gray-100" />

        {/* Canvas Background Section */}
        <div>
           <label className="text-[11px] font-bold text-gray-800 mb-2 block">Canvas background</label>
           <button
             onClick={() => setShowGrid(!showGrid)}
             className={`w-full py-2 px-3 rounded-md text-xs flex items-center justify-between transition-colors ${showGrid ? "bg-[#e0dfff] text-[#5b5bd6]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
           >
              <span>Grid Mode</span>
              <Grid3X3 className="w-3 h-3" />
           </button>
        </div>
        
         <div className="flex justify-between items-center pt-2">
             <span className="text-[11px] font-bold text-gray-800">Theme</span>
             <div className="flex bg-gray-100 p-0.5 rounded border border-gray-200">
                <button className="p-1.5 bg-white rounded shadow-sm"><Moon className="w-3 h-3 text-gray-800" /></button>
             </div>
         </div>
      </div>
    </div>
  );
}

function BottomControls({ zoom, onZoomIn, onZoomOut, onUndo, onRedo }: any) {
  return (
    <div className="fixed bottom-4 left-4 z-30 flex items-center gap-3">
       {/* Zoom Controls */}
       <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-500">
          <button onClick={onZoomOut} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Zoom Out">
              <MinusIcon className="w-4 h-4" />
          </button>
          <span className="px-2 text-xs font-mono text-gray-700 w-12 text-center select-none">
              {Math.round(zoom * 100)}%
          </span>
          <button onClick={onZoomIn} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Zoom In">
              <PlusIcon className="w-4 h-4" />
          </button>
       </div>

       {/* Undo/Redo Controls */}
       <div className="flex items-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-500">
           <button onClick={onUndo} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Undo (Ctrl+Z)">
               <Undo2 className="w-4 h-4" />
           </button>
           <button onClick={onRedo} className="p-2 hover:bg-gray-100 rounded-md transition-colors" title="Redo (Ctrl+Y)">
               <Redo2 className="w-4 h-4" />
           </button>
       </div>
    </div>
  );
}

function InstructionsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-[1px]">
      <div className="bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-bold text-gray-800">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 overflow-y-auto max-h-[60vh]">
           <div className="grid grid-cols-2 gap-1 text-xs">
              {[
                  {k: 'H', l: 'Hand (Pan)'},
                  {k: 'R', l: 'Rectangle'},
                  {k: 'C', l: 'Circle'},
                  {k: 'T', l: 'Triangle'},
                  {k: 'L', l: 'Line'},
                  {k: 'P', l: 'Pencil'},
                  {k: 'X', l: 'Text'},
                  {k: 'E', l: 'Eraser'},
              ].map(item => (
                 <div key={item.k} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-600">{item.l}</span>
                    <kbd className="bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-gray-500">{item.k}</kbd>
                 </div>
              ))}
           </div>
           <div className="mt-4 p-3 bg-purple-50 text-purple-700 text-xs rounded-lg text-center space-y-1">
              <div><b>Ctrl + Z</b> to Undo • <b>Ctrl + Y</b> to Redo</div>
              <div><b>Wheel</b> to Zoom • <b>Middle Click</b> to Pan</div>
           </div>
        </div>
      </div>
    </div>
  );
}

function TextInstructions() {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4">
      <div className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 text-xs">
         <TextIcon className="w-3 h-3 text-green-400" />
         <span>Click anywhere to start typing</span>
         <span className="w-px h-3 bg-gray-600 mx-1" />
         <span className="text-gray-400">Press Esc to cancel, Enter to submit</span>
      </div>
    </div>
  );
}