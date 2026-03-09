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
  Hand,
  HelpCircle,
  Palette,
  Minus as MinusIcon,
  Plus as PlusIcon,
  Undo2,
  Redo2,
  Moon,
  Grid3X3,
  Trash2,
  Download,
  MoveRight,
  Diamond,
  Star,
} from "lucide-react";
import { Game } from "@/draw/Game";
import { PDFExporter, ExportOptions } from "@/utils/pdfExport";
import { ExportModal } from "./ExportModal";

// --- Types & Constants ---

export type Tool =
  | "select"
  | "circle"
  | "rect"
  | "pencil"
  | "triangle"
  | "line"
  | "arrow"
  | "diamond"
  | "star"
  | "eraser"
  | "text"
  | "hand";

const COLORS = [
  "#000000", "#343a40", "#495057",
  "#c92a2a", "#a61e4d", "#862e9c",
  "#5f3dc4", "#364fc7", "#1864ab",
  "#0b7285", "#087f5b", "#2b8a3e",
  "#5c940d", "#e67700", "#d9480f",
  "#ffffff",
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
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [strokeSize, setStrokeSize] = useState<number>(2);
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [zoom, setZoom] = useState<number>(1);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Canvas resize
  useEffect(() => {
    const update = () => setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Sync state to Game
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
      setZoom(g.getZoom());
      return () => g.destroy();
    }
  }, [canvasRef, roomId, socket, canvasSize]);

  // Real-time socket listener
  useEffect(() => {
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
          const parsed = JSON.parse(message.message);
          if (parsed) {
            if (parsed.shape) {
              game?.addShape(parsed.shape);
            } else if (parsed.type === "delete_shape" && parsed.shapeId) {
              game?.removeShapeById(parsed.shapeId);
            } else if (parsed.type === "move_shape" && parsed.shapeId && parsed.shape) {
              game?.moveShapeById(parsed.shapeId, parsed.shape);
            }
          }
        }
      } catch (e) {
        console.error("Error parsing socket message:", e);
      }
    };
    return () => { socket.onmessage = null; };
  }, [socket, game]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedTool === "text") return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();

      if (key === "v") setSelectedTool("select");
      else if (key === "p") setSelectedTool("pencil");
      else if (key === "r") setSelectedTool("rect");
      else if (key === "c") setSelectedTool("circle");
      else if (key === "t") setSelectedTool("triangle");
      else if (key === "l") setSelectedTool("line");
      else if (key === "a") setSelectedTool("arrow");
      else if (key === "d") setSelectedTool("diamond");
      else if (key === "s" && !e.ctrlKey && !e.metaKey) setSelectedTool("star");
      else if (key === "e") setSelectedTool("eraser");
      else if (key === "x") setSelectedTool("text");
      else if (key === "h") setSelectedTool("hand");
      else if ((key === "delete" || key === "backspace") && selectedTool === "select") {
        game?.deleteSelected(); e.preventDefault();
      }
      else if (key === "z" && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) game?.redo(); else game?.undo(); e.preventDefault();
      }
      else if (key === "y" && (e.ctrlKey || e.metaKey)) { game?.redo(); e.preventDefault(); }
      else if (key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) setShowExportModal(true);
        else setShowSettings(v => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedTool, game]);

  // Zoom sync on scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !game) return;
    const update = () => requestAnimationFrame(() => setZoom(game.getZoom()));
    canvas.addEventListener('wheel', update);
    return () => canvas.removeEventListener('wheel', update);
  }, [game]);

  const onZoomIn = () => { const z = (game?.getZoom() || 1) + 0.1; game?.setZoom(z); setZoom(z); };
  const onZoomOut = () => { const z = (game?.getZoom() || 1) - 0.1; game?.setZoom(z); setZoom(z); };

  const handleExport = async (options: ExportOptions = {}) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    try {
      await PDFExporter.exportHighQualityPDF(canvasRef.current, {
        filename: `valhalla-brush-${roomId}-${Date.now()}`,
        includeBackground: true, orientation: "landscape", ...options,
      });
    } catch (error) { console.error("Export failed:", error); }
    finally { setIsExporting(false); setShowExportModal(false); }
  };

  const getCursor = () => {
    switch (selectedTool) {
      case "hand": return "grab";
      case "text": return "text";
      case "select": return "default";
      case "eraser": return "none";
      default: return "crosshair";
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f8f9fa] font-sans text-slate-900">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0 z-10 touch-none"
        style={{ cursor: getCursor() }}
      />

      <ToolBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />

      <SidebarMenu
        onExport={() => setShowExportModal(true)}
        onToggleHelp={() => setShowInstructions(v => !v)}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {showSettings && (
        <PropertiesPanel
          selectedColor={selectedColor} setSelectedColor={setSelectedColor}
          strokeSize={strokeSize} setStrokeSize={setStrokeSize}
          eraserSize={eraserSize} setEraserSize={setEraserSize}
          selectedTool={selectedTool}
          showGrid={showGrid} setShowGrid={setShowGrid}
        />
      )}

      {/* Room badge */}
      <div className="fixed top-4 right-4 z-30 flex gap-2 items-center">
        <div className="h-9 px-3 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-lg text-xs font-medium flex items-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Room: {roomId}
        </div>
        <button className="h-9 px-3 bg-[#e0dfff] hover:bg-[#d0cfff] text-[#5b5bd6] rounded-lg text-xs font-bold transition-colors shadow-sm">
          Valhalla Brush
        </button>
      </div>

      <BottomControls
        zoom={zoom} onZoomIn={onZoomIn} onZoomOut={onZoomOut}
        onUndo={() => game?.undo()} onRedo={() => game?.redo()}
        onDeleteSelected={() => game?.deleteSelected()}
        selectedTool={selectedTool}
      />

      {selectedTool === "text" && <ToolHint icon={<TextIcon className="w-3.5 h-3.5 text-emerald-400" />} main="Click anywhere to start typing" sub="Esc to cancel · Enter to submit" />}
      {selectedTool === "select" && <ToolHint icon={<MousePointer2 className="w-3.5 h-3.5 text-[#8b8bf9]" />} main="Click to select · Drag to move" sub="Delete or Backspace to remove" />}

      {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
      {showExportModal && <ExportModal onExport={handleExport} onClose={() => setShowExportModal(false)} isExporting={isExporting} />}
    </div>
  );
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function ToolBar({ selectedTool, setSelectedTool }: { selectedTool: Tool; setSelectedTool: (t: Tool) => void }) {
  const toolGroups = [
    // Selection & Navigation
    [
      { id: "select", icon: MousePointer2, label: "Select (V)" },
      { id: "hand", icon: Hand, label: "Hand (H)" },
    ],
    // Basic shapes
    [
      { id: "rect", icon: Square, label: "Rectangle (R)" },
      { id: "circle", icon: Circle, label: "Circle (C)" },
      { id: "triangle", icon: Triangle, label: "Triangle (T)" },
      { id: "diamond", icon: Diamond, label: "Diamond (D)" },
      { id: "star", icon: Star, label: "Star (S)" },
    ],
    // Lines & Freehand
    [
      { id: "line", icon: Minus, label: "Line (L)" },
      { id: "arrow", icon: MoveRight, label: "Arrow (A)" },
      { id: "pencil", icon: Pencil, label: "Draw (P)" },
      { id: "text", icon: TextIcon, label: "Text (X)" },
    ],
    // Eraser
    [
      { id: "eraser", icon: Eraser, label: "Eraser (E)" },
    ],
  ];

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="flex items-center bg-white shadow-lg border border-gray-200 rounded-xl p-1">
        {toolGroups.map((group, gi) => (
          <div key={gi} className="flex items-center">
            {gi > 0 && <div className="w-px h-6 bg-gray-200 mx-0.5" />}
            {group.map(tool => {
              const isActive = selectedTool === tool.id;
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id as Tool)}
                  className={`relative group p-2 rounded-lg transition-all duration-150
                    ${isActive ? "bg-[#e0dfff] text-[#5b5bd6] shadow-sm" : "hover:bg-gray-100 text-gray-600"}`}
                  title={tool.label}
                >
                  <Icon className="w-[17px] h-[17px]" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarMenu({ onExport, onToggleHelp, showSettings, setShowSettings }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)} className="bg-white hover:bg-gray-50 p-2.5 rounded-xl shadow-lg border border-gray-200 text-gray-700 transition-all hover:shadow-xl">
          <Menu className="w-5 h-5" />
        </button>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-gray-200 rounded-xl overflow-hidden z-40">
              <div className="py-1">
                <div className="px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Canvas</div>
                <button onClick={() => { setShowSettings(!showSettings); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center transition-colors">
                  <span>Properties</span><Palette className="w-4 h-4 opacity-50" />
                </button>
                <button onClick={() => { onExport(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center transition-colors">
                  <span className="flex items-center gap-2"><Download className="w-3.5 h-3.5 opacity-60" />Export</span>
                  <span className="text-[10px] text-gray-400">⇧⌘S</span>
                </button>
                <div className="h-px bg-gray-100 my-1" />
                <button onClick={() => { onToggleHelp(); setIsOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#e0dfff] hover:text-[#5b5bd6] flex justify-between items-center transition-colors">
                  <span>Shortcuts</span><HelpCircle className="w-4 h-4 opacity-50" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PropertiesPanel({ selectedColor, setSelectedColor, strokeSize, setStrokeSize, eraserSize, setEraserSize, selectedTool, showGrid, setShowGrid }: any) {
  const [customColor, setCustomColor] = useState<string>("#000000");
  return (
    <div className="fixed top-20 left-4 z-30 w-[220px]">
      <div className="bg-white shadow-lg border border-gray-200 rounded-xl p-3.5 space-y-4 overflow-y-auto max-h-[80vh]">
        {/* Colors */}
        <div>
          <label className="text-[11px] font-bold text-gray-800 mb-2 block uppercase tracking-wider">Color</label>
          <div className="grid grid-cols-5 gap-1.5">
            {COLORS.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)}
                className={`w-7 h-7 rounded-md border-2 transition-all duration-150 hover:scale-110 ${selectedColor === c ? "border-[#5b5bd6] ring-2 ring-[#5b5bd6]/30 scale-110" : "border-transparent hover:border-gray-300"}`}
                style={{ backgroundColor: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #e5e7eb" : undefined }}
              />
            ))}
            <div className="relative w-7 h-7 rounded-md overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition-colors">
              <input type="color" value={customColor} onChange={e => { setCustomColor(e.target.value); setSelectedColor(e.target.value); }}
                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0" />
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-100" />
        {/* Stroke / Eraser width */}
        {selectedTool !== "eraser" ? (
          <div>
            <label className="text-[11px] font-bold text-gray-800 mb-2 block uppercase tracking-wider">Stroke</label>
            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg mb-2">
              {[2, 4, 6, 8].map(s => (
                <button key={s} onClick={() => setStrokeSize(s)}
                  className={`flex-1 h-8 flex items-center justify-center rounded-md transition-all ${strokeSize === s ? "bg-[#e0dfff] shadow-sm" : "hover:bg-gray-200"}`}>
                  <div className={`bg-gray-900 rounded-full ${strokeSize === s ? "opacity-100" : "opacity-40"}`} style={{ height: Math.min(s * 1.5, 12), width: 20 }} />
                </button>
              ))}
            </div>
            <input type="range" min="1" max="20" value={strokeSize} onChange={e => setStrokeSize(parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b5bd6]" />
          </div>
        ) : (
          <div>
            <label className="text-[11px] font-bold text-gray-800 mb-2 block uppercase tracking-wider">Eraser Size</label>
            <div className="flex items-center gap-3">
              <input type="range" min="5" max="50" value={eraserSize} onChange={e => setEraserSize(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5b5bd6]" />
              <span className="text-xs text-gray-500 font-mono w-8 text-right">{eraserSize}px</span>
            </div>
          </div>
        )}
        <div className="h-px bg-gray-100" />
        {/* Grid */}
        <div>
          <button onClick={() => setShowGrid(!showGrid)}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-medium flex items-center justify-between transition-all ${showGrid ? "bg-[#e0dfff] text-[#5b5bd6] shadow-sm" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
            <span>Grid</span><Grid3X3 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Theme</span>
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50"><Moon className="w-3 h-3 text-gray-800" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomControls({ zoom, onZoomIn, onZoomOut, onUndo, onRedo, onDeleteSelected, selectedTool }: any) {
  return (
    <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2">
      <div className="flex items-center bg-white shadow-lg border border-gray-200 rounded-xl p-1 text-gray-500">
        <button onClick={onZoomOut} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Zoom Out"><MinusIcon className="w-4 h-4" /></button>
        <span className="px-2 text-xs font-mono text-gray-700 w-12 text-center select-none">{Math.round(zoom * 100)}%</span>
        <button onClick={onZoomIn} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Zoom In"><PlusIcon className="w-4 h-4" /></button>
      </div>
      <div className="flex items-center bg-white shadow-lg border border-gray-200 rounded-xl p-1 text-gray-500">
        <button onClick={onUndo} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Undo (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
        <button onClick={onRedo} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Redo (Ctrl+Y)"><Redo2 className="w-4 h-4" /></button>
      </div>
      {selectedTool === "select" && (
        <div className="flex items-center bg-white shadow-lg border border-gray-200 rounded-xl p-1">
          <button onClick={onDeleteSelected} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors" title="Delete (Del)">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function ToolHint({ icon, main, sub }: { icon: React.ReactNode; main: string; sub: string }) {
  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-gray-900 text-white px-5 py-2.5 rounded-xl shadow-xl flex items-center gap-3 text-xs border border-gray-700">
        {icon}
        <span>{main}</span>
        <span className="w-px h-4 bg-gray-600" />
        <span className="text-gray-400">{sub}</span>
      </div>
    </div>
  );
}

function InstructionsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { k: 'V', l: 'Select' }, { k: 'H', l: 'Hand' },
    { k: 'R', l: 'Rectangle' }, { k: 'C', l: 'Circle' },
    { k: 'T', l: 'Triangle' }, { k: 'D', l: 'Diamond' },
    { k: 'S', l: 'Star' }, { k: 'L', l: 'Line' },
    { k: 'A', l: 'Arrow' }, { k: 'P', l: 'Pencil' },
    { k: 'X', l: 'Text' }, { k: 'E', l: 'Eraser' },
    { k: 'Del', l: 'Delete Shape' },
  ];
  return (
    <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl w-[440px] max-w-[90vw] overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-lg">Keyboard Shortcuts</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-1 text-xs">
            {shortcuts.map(item => (
              <div key={item.k} className="flex justify-between items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-gray-600">{item.l}</span>
                <kbd className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md font-mono text-[10px] text-gray-500 shadow-sm">{item.k}</kbd>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3.5 bg-[#e0dfff]/50 text-[#5b5bd6] text-xs rounded-xl text-center space-y-1.5 border border-[#e0dfff]">
            <div><b>Ctrl+Z</b> Undo · <b>Ctrl+Y</b> Redo</div>
            <div><b>Scroll</b> Zoom · <b>Middle Click</b> or <b>H</b> Pan</div>
          </div>
        </div>
      </div>
    </div>
  );
}