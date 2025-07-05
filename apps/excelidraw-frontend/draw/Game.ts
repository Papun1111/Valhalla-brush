import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./index";

export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number; color: string; strokeSize: number; }
  | { type: "circle"; centerX: number; centerY: number; radius: number; color: string; strokeSize: number; }
  | { type: "pencil"; points: Array<{ x: number; y: number }>; color: string; strokeSize: number; }
  | { type: "triangle"; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number; color: string; strokeSize: number; }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number; color: string; strokeSize: number; }
  | { type: "text"; x: number; y: number; text: string; color: string; font: string; };

export class Game {
  private existingShapes: Shape[] = [];
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private selectedColor: string = "#FFFFFF";
  private strokeSize: number = 2;
  private eraserSize: number = 20;
  private currentPencilPoints: Array<{ x: number; y: number }> = [];

  // For text tool
  private awaitingText = false;
  private textX = 0;
  private textY = 0;
  private currentText = "";

  private ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement,
    private roomId: string,
    private socket: WebSocket
  ) {
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
    this.initTouchHandlers(); // Add touch handlers
  }

  public destroy(): void {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    
    // Remove touch event listeners
    this.canvas.removeEventListener("touchstart", this.touchStartHandler);
    this.canvas.removeEventListener("touchend", this.touchEndHandler);
    this.canvas.removeEventListener("touchmove", this.touchMoveHandler);
    
    window.removeEventListener("keydown", this.keyDownHandler);
  }

  public setTool(tool: Tool): void {
    this.selectedTool = tool;
    // If switching away from text, cancel any in‐progress typing
    if (tool !== "text" && this.awaitingText) {
      this.awaitingText = false;
      this.currentText = "";
      window.removeEventListener("keydown", this.keyDownHandler);
      this.clearCanvas();
    }
  }

  public setColor(color: string): void {
    this.selectedColor = color;
  }

  public setStrokeSize(size: number): void {
    this.strokeSize = size;
  }

  public setEraserSize(size: number): void {
    this.eraserSize = size;
  }

  private async init(): Promise<void> {
    try {
      this.existingShapes = await getExistingShapes(this.roomId);
    } catch (error) {
      console.warn("Failed to load existing shapes:", error);
      this.existingShapes = [];
    }
    this.clearCanvas();
  }

  private initHandlers(): void {
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data) as { type: string; message: string };
        if (message.type === "chat") {
          const { shape } = JSON.parse(message.message) as { shape: Shape };
          this.existingShapes.push(shape);
          this.clearCanvas();
        }
      } catch (error) {
        console.error("Error handling socket message:", error);
      }
    };
  }

  private clearCanvas(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    
    // Set a subtle dark background instead of pure black
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.95)"; // slate-900 with slight transparency
    this.ctx.fillRect(0, 0, width, height);

    // Configure canvas for better drawing
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    for (const shape of this.existingShapes) {
      this.ctx.strokeStyle = shape.color;
      this.ctx.fillStyle = shape.color;

      switch (shape.type) {
        case "rect":
          this.ctx.lineWidth = shape.strokeSize || 2;
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          this.ctx.lineWidth = shape.strokeSize || 2;
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
          break;
        case "pencil":
          if (shape.points.length) {
            this.ctx.lineWidth = shape.strokeSize || 2;
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.forEach((p) => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
            this.ctx.closePath();
          }
          break;
        case "triangle":
          this.ctx.lineWidth = shape.strokeSize || 2;
          this.ctx.beginPath();
          this.ctx.moveTo(shape.x1, shape.y1);
          this.ctx.lineTo(shape.x2, shape.y2);
          this.ctx.lineTo(shape.x3, shape.y3);
          this.ctx.closePath();
          this.ctx.stroke();
          break;
        case "line":
          this.ctx.lineWidth = shape.strokeSize || 2;
          this.ctx.beginPath();
          this.ctx.moveTo(shape.startX, shape.startY);
          this.ctx.lineTo(shape.endX, shape.endY);
          this.ctx.stroke();
          this.ctx.closePath();
          break;
        case "text":
          this.ctx.font = shape.font;
          this.ctx.fillText(shape.text, shape.x, shape.y);
          break;
      }
    }

    // If typing right now, draw the in‐progress text
    if (this.awaitingText && this.currentText) {
      this.ctx.font = "16px sans-serif";
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.fillText(this.currentText, this.textX, this.textY);
    }
  }

  // Helper method to get coordinates from mouse or touch event
  private getCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if (e instanceof TouchEvent) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        return { x: 0, y: 0 };
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  private handleStart(e: MouseEvent | TouchEvent): void {
    const { x, y } = this.getCoordinates(e);

    // Text: click to begin typing
    if (this.selectedTool === "text") {
      // If we were already typing, finalize the previous text
      if (this.awaitingText && this.currentText) {
        this.finalizeText();
      }
      
      this.awaitingText = true;
      this.textX = x;
      this.textY = y;
      this.currentText = "";
      window.addEventListener("keydown", this.keyDownHandler);
      this.clearCanvas();
      return;
    }

    this.clicked = true;
    this.startX = x;
    this.startY = y;
    if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.currentPencilPoints = [{ x, y }];
    }
  }

  private handleEnd(e: MouseEvent | TouchEvent): void {
    if (this.selectedTool === "text") {
      // Text is handled by clicks and keyboard, not mouse/touch up
      return;
    }

    if (!this.clicked) return;
    this.clicked = false;
    const { x, y } = this.getCoordinates(e);
    const dx = x - this.startX;
    const dy = y - this.startY;

    let shape: Shape | null = null;
    const color = this.selectedTool === "eraser" ? "rgba(15, 23, 42, 0.95)" : this.selectedColor;
    const strokeSize = this.selectedTool === "eraser" ? this.eraserSize : this.strokeSize;

    switch (this.selectedTool) {
      case "rect":
        shape = { 
          type: "rect", 
          x: this.startX, 
          y: this.startY, 
          width: dx, 
          height: dy, 
          color, 
          strokeSize 
        };
        break;
      case "circle":
        const radius = Math.sqrt(dx * dx + dy * dy) / 2;
        shape = {
          type: "circle",
          centerX: this.startX + dx / 2,
          centerY: this.startY + dy / 2,
          radius,
          color,
          strokeSize,
        };
        break;
      case "pencil":
      case "eraser":
        if (this.currentPencilPoints.length > 1) {
          shape = {
            type: "pencil",
            points: [...this.currentPencilPoints],
            color,
            strokeSize,
          };
        }
        break;
      case "triangle":
        const x3 = this.startX - dx;
        shape = {
          type: "triangle",
          x1: this.startX,
          y1: this.startY,
          x2: x,
          y2: y,
          x3,
          y3: y,
          color,
          strokeSize,
        };
        break;
      case "line":
        shape = {
          type: "line",
          startX: this.startX,
          startY: this.startY,
          endX: x,
          endY: y,
          color,
          strokeSize,
        };
        break;
    }

    this.currentPencilPoints = [];
    if (shape) this.pushShape(shape);
  }

  private handleMove(e: MouseEvent | TouchEvent): void {
    if (this.selectedTool === "text") return;
    if (!this.clicked) return;

    const { x, y } = this.getCoordinates(e);

    if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.currentPencilPoints.push({ x, y });
    }

    this.clearCanvas();
    this.ctx.strokeStyle = this.selectedTool === "eraser" ? "rgba(15, 23, 42, 0.95)" : this.selectedColor;
    this.ctx.lineWidth = this.selectedTool === "eraser" ? this.eraserSize : this.strokeSize;

    switch (this.selectedTool) {
      case "rect":
        this.ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
        break;
      case "circle":
        const dx = x - this.startX;
        const dy = y - this.startY;
        const radius = Math.sqrt(dx * dx + dy * dy) / 2;
        this.ctx.beginPath();
        this.ctx.arc(this.startX + dx / 2, this.startY + dy / 2, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "pencil":
      case "eraser":
        if (this.currentPencilPoints.length > 0) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
          this.currentPencilPoints.forEach((p) => this.ctx.lineTo(p.x, p.y));
          this.ctx.stroke();
          this.ctx.closePath();
        }
        break;
      case "triangle":
        const triDx = x - this.startX;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(this.startX - triDx, y);
        this.ctx.closePath();
        this.ctx.stroke();
        break;
      case "line":
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
    }
  }

  // Mouse event handlers
  private mouseDownHandler = (e: MouseEvent): void => {
    this.handleStart(e);
  };

  private mouseUpHandler = (e: MouseEvent): void => {
    this.handleEnd(e);
  };

  private mouseMoveHandler = (e: MouseEvent): void => {
    this.handleMove(e);
  };

  // Touch event handlers
  private touchStartHandler = (e: TouchEvent): void => {
    e.preventDefault(); // Prevent scrolling, zooming, etc.
    this.handleStart(e);
  };

  private touchEndHandler = (e: TouchEvent): void => {
    e.preventDefault();
    this.handleEnd(e);
  };

  private touchMoveHandler = (e: TouchEvent): void => {
    e.preventDefault();
    this.handleMove(e);
  };

  private initMouseHandlers(): void {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private initTouchHandlers(): void {
    // Add touch event listeners
    this.canvas.addEventListener("touchstart", this.touchStartHandler, { passive: false });
    this.canvas.addEventListener("touchend", this.touchEndHandler, { passive: false });
    this.canvas.addEventListener("touchmove", this.touchMoveHandler, { passive: false });
  }

  private keyDownHandler = (e: KeyboardEvent) => {
    if (!this.awaitingText) return;
    
    e.preventDefault(); // Prevent default browser behavior
    
    if (e.key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    } else if (e.key === "Enter") {
      this.finalizeText();
      return;
    } else if (e.key === "Escape") {
      this.cancelText();
      return;
    } else if (e.key.length === 1) {
      this.currentText += e.key;
    }
    this.clearCanvas();
  };

  private finalizeText(): void {
    if (!this.currentText.trim()) {
      this.cancelText();
      return;
    }
    
    const shape: Shape = {
      type: "text",
      x: this.textX,
      y: this.textY,
      text: this.currentText,
      color: this.selectedColor,
      font: "16px sans-serif",
    };
    
    this.pushShape(shape);
    this.awaitingText = false;
    window.removeEventListener("keydown", this.keyDownHandler);
    this.currentText = "";
  }

  private cancelText(): void {
    this.awaitingText = false;
    window.removeEventListener("keydown", this.keyDownHandler);
    this.currentText = "";
    this.clearCanvas();
  }

  private pushShape(shape: Shape) {
    this.existingShapes.push(shape);
    try {
      this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      }));
    } catch (error) {
      console.error("Failed to send shape to server:", error);
    }
    this.clearCanvas();
  }
}