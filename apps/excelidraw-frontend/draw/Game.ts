import { Tool } from "@/components/Canvas";
import { getExistingShapes, Shape } from "./index";

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private roomId: string;
  private socket: WebSocket;
  private existingShapes: Shape[] = [];
  
  // Undo/Redo
  private history: Shape[][] = [];
  private historyIndex: number = -1;

  // Viewport
  private scale: number = 1;
  private panX: number = 0;
  private panY: number = 0;
  private isPanning: boolean = false;
  private showGrid: boolean = true;

  // Interaction
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Tools
  private selectedTool: Tool = "circle";
  private selectedColor: string = "#000000";
  private strokeSize: number = 2;
  private eraserSize: number = 20;
  private currentPencilPoints: Array<{ x: number; y: number }> = [];

  // Text
  private awaitingText = false;
  private textX = 0;
  private textY = 0;
  private currentText = "";

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.ctx = canvas.getContext("2d")!;
    
    this.init();
    // Note: We no longer attach socket READ listeners here. 
    // We only use socket for WRITING (sending shapes).
    this.initMouseListeners();
    this.initTouchListeners();
  }

  public destroy(): void {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("wheel", this.wheelHandler);
    this.canvas.removeEventListener("touchstart", this.touchStartHandler);
    this.canvas.removeEventListener("touchend", this.touchEndHandler);
    this.canvas.removeEventListener("touchmove", this.touchMoveHandler);
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  // ==============================
  // PUBLIC API (Called by UI)
  // ==============================

  // This is the new method that Canvas.tsx will call
  public addShape(shape: Shape): void {
      this.existingShapes.push(shape);
      this.clearCanvas();
  }

  public setTool(tool: Tool): void {
    this.selectedTool = tool;
    if (tool !== "text" && this.awaitingText) this.cancelText();
  }
  public setColor(color: string): void { this.selectedColor = color; }
  public setStrokeSize(size: number): void { this.strokeSize = size; }
  public setEraserSize(size: number): void { this.eraserSize = size; }
  public setShowGrid(show: boolean): void { this.showGrid = show; this.clearCanvas(); }
  public setZoom(scale: number): void { this.scale = Math.max(0.1, Math.min(5, scale)); this.clearCanvas(); }
  public getZoom(): number { return this.scale; }

  public undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.clearCanvas();
    }
  }

  public redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.clearCanvas();
    }
  }

  // ==============================
  // INTERNAL LOGIC
  // ==============================

  private async init(): Promise<void> {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
      this.saveHistory(); 
    } catch (error) {
      console.warn("Failed to load existing shapes:", error);
      this.existingShapes = [];
    }
    this.clearCanvas();
  }

  private saveHistory(increment: boolean = true): void {
    const snapshot = JSON.parse(JSON.stringify(this.existingShapes));
    if (increment) {
      if (this.historyIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyIndex + 1);
      }
      this.history.push(snapshot);
      this.historyIndex++;
    } else {
        if(this.historyIndex >= 0) this.history[this.historyIndex] = snapshot;
        else { this.history.push(snapshot); this.historyIndex = 0; }
    }
  }

  private clearCanvas(): void {
    const { width, height } = this.canvas;
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "#f8f9fa"; 
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);

    if (this.showGrid) this.drawGrid(width, height);

    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    this.existingShapes.forEach((shape) => this.drawShape(shape));

    if (this.awaitingText && this.currentText) {
      this.ctx.font = "16px sans-serif";
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.fillText(this.currentText, this.textX, this.textY);
    }

    this.ctx.restore();
  }

  private drawGrid(width: number, height: number) {
    const gridSize = 20;
    const dotSize = 1 / this.scale;
    const startX = -this.panX / this.scale;
    const startY = -this.panY / this.scale;
    const endX = startX + width / this.scale;
    const endY = startY + height / this.scale;
    const gridStartX = Math.floor(startX / gridSize) * gridSize;
    const gridStartY = Math.floor(startY / gridSize) * gridSize;

    this.ctx.fillStyle = "#ccc";
    for (let x = gridStartX; x < endX; x += gridSize) {
      for (let y = gridStartY; y < endY; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
  }

  private drawShape(shape: Shape) {
    this.ctx.strokeStyle = shape.color;
    this.ctx.fillStyle = shape.color;
    if ("strokeSize" in shape) this.ctx.lineWidth = shape.strokeSize;

    switch (shape.type) {
      case "rect":
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        this.ctx.beginPath();
        this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        break;
      case "pencil":
        if (shape.points.length) {
          this.ctx.beginPath();
          this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
          shape.points.forEach((p) => this.ctx.lineTo(p.x, p.y));
          this.ctx.stroke();
        }
        break;
      case "triangle":
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.lineTo(shape.x3, shape.y3);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        break;
      case "text":
        this.ctx.font = shape.font;
        this.ctx.fillText(shape.text, shape.x, shape.y);
        break;
    }
  }

  private getWorldCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;
    if (window.TouchEvent && e instanceof TouchEvent) {
       const touch = e.touches[0] || e.changedTouches[0];
       clientX = touch.clientX; clientY = touch.clientY;
    } else {
       clientX = (e as MouseEvent).clientX; clientY = (e as MouseEvent).clientY;
    }
    return {
      x: (clientX - rect.left - this.panX) / this.scale,
      y: (clientY - rect.top - this.panY) / this.scale
    };
  }

  // --- Handlers ---

  private handleStart(e: MouseEvent | TouchEvent): void {
    const { x, y } = this.getWorldCoordinates(e);

    if (this.selectedTool === "hand" || (e instanceof MouseEvent && e.button === 1)) {
        this.isPanning = true;
        this.lastMouseX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        this.lastMouseY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        return;
    }
    if (this.selectedTool === "text") {
      if (this.awaitingText && this.currentText) this.finalizeText();
      this.awaitingText = true; this.textX = x; this.textY = y; this.currentText = "";
      window.addEventListener("keydown", this.keyDownHandler);
      this.clearCanvas();
      return;
    }
    this.clicked = true; this.startX = x; this.startY = y;
    if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.currentPencilPoints = [{ x, y }];
    }
  }

  private handleMove(e: MouseEvent | TouchEvent): void {
    if (this.isPanning) {
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        this.panX += clientX - this.lastMouseX;
        this.panY += clientY - this.lastMouseY;
        this.lastMouseX = clientX; this.lastMouseY = clientY;
        this.clearCanvas();
        return;
    }
    if (this.selectedTool === "text" || !this.clicked) return;
    const { x, y } = this.getWorldCoordinates(e);

    if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.currentPencilPoints.push({ x, y });
    }

    this.clearCanvas(); // Render base
    
    // Preview Logic
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    
    const color = this.selectedTool === "eraser" ? "#f8f9fa" : this.selectedColor;
    const strokeSize = this.selectedTool === "eraser" ? this.eraserSize : this.strokeSize;
    this.ctx.strokeStyle = color; this.ctx.fillStyle = color; this.ctx.lineWidth = strokeSize;
    this.ctx.lineCap = "round"; this.ctx.lineJoin = "round";

    const dx = x - this.startX; const dy = y - this.startY;

    switch (this.selectedTool) {
      case "rect": this.ctx.strokeRect(this.startX, this.startY, dx, dy); break;
      case "circle": 
        const r = Math.sqrt(dx*dx + dy*dy)/2;
        this.ctx.beginPath(); this.ctx.arc(this.startX+dx/2, this.startY+dy/2, r, 0, Math.PI*2); this.ctx.stroke(); 
        break;
      case "pencil":
      case "eraser":
        if (this.currentPencilPoints.length > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
            this.currentPencilPoints.forEach(p => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
        }
        break;
      case "triangle":
         this.ctx.beginPath(); this.ctx.moveTo(this.startX, this.startY);
         this.ctx.lineTo(x, y); this.ctx.lineTo(this.startX - dx, y);
         this.ctx.closePath(); this.ctx.stroke();
        break;
      case "line":
        this.ctx.beginPath(); this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y); this.ctx.stroke();
        break;
    }
    this.ctx.restore();
  }

  private handleEnd(e: MouseEvent | TouchEvent): void {
    if (this.isPanning) { this.isPanning = false; return; }
    if (this.selectedTool === "text" || !this.clicked) return;
    this.clicked = false;
    const { x, y } = this.getWorldCoordinates(e);
    const dx = x - this.startX; const dy = y - this.startY;

    let shape: Shape | null = null;
    const color = this.selectedTool === "eraser" ? "#f8f9fa" : this.selectedColor;
    const strokeSize = this.selectedTool === "eraser" ? this.eraserSize : this.strokeSize;

    switch (this.selectedTool) {
      case "rect": if(Math.abs(dx)>1 && Math.abs(dy)>1) shape = { type: "rect", x: this.startX, y: this.startY, width: dx, height: dy, color, strokeSize }; break;
      case "circle": 
        const r = Math.sqrt(dx*dx + dy*dy)/2;
        if(r>1) shape = { type: "circle", centerX: this.startX+dx/2, centerY: this.startY+dy/2, radius: r, color, strokeSize }; 
        break;
      case "pencil":
      case "eraser": if (this.currentPencilPoints.length > 1) shape = { type: "pencil", points: [...this.currentPencilPoints], color, strokeSize }; break;
      case "triangle": shape = { type: "triangle", x1: this.startX, y1: this.startY, x2: x, y2: y, x3: this.startX - dx, y3: y, color, strokeSize }; break;
      case "line": shape = { type: "line", startX: this.startX, startY: this.startY, endX: x, endY: y, color, strokeSize }; break;
    }

    if (shape) {
        this.pushShape(shape); // Push to array + Socket
    }
    this.currentPencilPoints = [];
    this.clearCanvas();
  }

  private pushShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.saveHistory();
    // Send to Socket
    if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({ shape }),
            roomId: this.roomId,
        }));
    }
  }

  private keyDownHandler = (e: KeyboardEvent) => {
    if (!this.awaitingText) return;
    if (e.key === "Backspace") this.currentText = this.currentText.slice(0, -1);
    else if (e.key === "Enter") this.finalizeText();
    else if (e.key === "Escape") this.cancelText();
    else if (e.key.length === 1) this.currentText += e.key;
    this.clearCanvas();
  };

  private finalizeText(): void {
    if (this.currentText.trim()) this.pushShape({ type: "text", x: this.textX, y: this.textY, text: this.currentText, color: this.selectedColor, font: "16px sans-serif" });
    this.cancelText();
  }
  private cancelText(): void { this.awaitingText = false; window.removeEventListener("keydown", this.keyDownHandler); this.currentText = ""; this.clearCanvas(); }

  private wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSens = 0.001; const delta = -e.deltaY * zoomSens;
      const oldScale = this.scale; const newScale = Math.max(0.1, Math.min(5, oldScale + delta));
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - this.panX) / oldScale; const worldY = (mouseY - this.panY) / oldScale;
      this.panX = mouseX - worldX * newScale; this.panY = mouseY - worldY * newScale;
      this.scale = newScale;
      this.clearCanvas();
  }

  // --- Listener Binding ---
  private mouseDownHandler = (e: MouseEvent) => this.handleStart(e);
  private mouseUpHandler = (e: MouseEvent) => this.handleEnd(e);
  private mouseMoveHandler = (e: MouseEvent) => this.handleMove(e);
  private touchStartHandler = (e: TouchEvent) => { e.preventDefault(); this.handleStart(e); };
  private touchEndHandler = (e: TouchEvent) => { e.preventDefault(); this.handleEnd(e); };
  private touchMoveHandler = (e: TouchEvent) => { e.preventDefault(); this.handleMove(e); };

  private initMouseListeners(): void {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("wheel", this.wheelHandler, { passive: false });
  }
  private initTouchListeners(): void {
    this.canvas.addEventListener("touchstart", this.touchStartHandler, { passive: false });
    this.canvas.addEventListener("touchend", this.touchEndHandler, { passive: false });
    this.canvas.addEventListener("touchmove", this.touchMoveHandler, { passive: false });
  }
}