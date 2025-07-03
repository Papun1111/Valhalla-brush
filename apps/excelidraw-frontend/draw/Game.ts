import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number; color: string; }
  | { type: "circle"; centerX: number; centerY: number; radius: number; color: string; }
  | { type: "pencil"; points: Array<{ x: number; y: number }>; color: string; }
  | { type: "triangle"; x1: number; y1: number; x2: number; y2: number; x3: number; y3: number; color: string; }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number; color: string; }
  | { type: "text"; x: number; y: number; text: string; color: string; font: string; };

export class Game {
  private existingShapes: Shape[] = [];
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private selectedColor: string = "#FFFFFF";
  private currentPencilPoints: Array<{ x: number; y: number }> = [];

  // For text tool
  private awaitingText = false;
  private textX = 0;
  private textY = 0;
  private currentText = "";

  constructor(
    private canvas: HTMLCanvasElement,
    private roomId: string,
    private socket: WebSocket
  ) {
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  private ctx: CanvasRenderingContext2D;

  public destroy(): void {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
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

  private async init(): Promise<void> {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  private initHandlers(): void {
    this.socket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data) as { type: string; message: string };
      if (message.type === "chat") {
        const { shape } = JSON.parse(message.message) as { shape: Shape };
        this.existingShapes.push(shape);
        this.clearCanvas();
      }
    };
  }

  private clearCanvas(): void {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, width, height);

    for (const shape of this.existingShapes) {
      this.ctx.strokeStyle = shape.color;
      this.ctx.fillStyle = shape.color;

      switch (shape.type) {
        case "rect":
          this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "circle":
          this.ctx.beginPath();
          this.ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.closePath();
          break;
        case "pencil":
          if (shape.points.length) {
            this.ctx.beginPath();
            this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
            shape.points.forEach((p) => this.ctx.lineTo(p.x, p.y));
            this.ctx.stroke();
            this.ctx.closePath();
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

  private mouseDownHandler = (e: MouseEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Text: click to begin typing
    if (this.selectedTool === "text") {
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
  };

  private mouseUpHandler = (e: MouseEvent): void => {
    if (this.selectedTool === "text") {
      // finalize text
      if (!this.currentText) return;
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
      return;
    }

    if (!this.clicked) return;
    this.clicked = false;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - this.startX;
    const dy = y - this.startY;

    let shape: Shape | null = null;
    const color = this.selectedTool === "eraser" ? "black" : this.selectedColor;

    switch (this.selectedTool) {
      case "rect":
        shape = { type: "rect", x: this.startX, y: this.startY, width: dx, height: dy, color };
        break;
      case "circle":
        const radius = Math.max(Math.abs(dx), Math.abs(dy)) / 2;
        shape = {
          type: "circle",
          centerX: this.startX + dx / 2,
          centerY: this.startY + dy / 2,
          radius,
          color,
        };
        break;
      case "pencil":
      case "eraser":
        if (this.currentPencilPoints.length > 1) {
          shape = {
            type: "pencil",
            points: [...this.currentPencilPoints],
            color,
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
        };
        break;
    }

    this.currentPencilPoints = [];
    if (shape) this.pushShape(shape);
  };

  private mouseMoveHandler = (e: MouseEvent): void => {
    if (this.selectedTool === "text") return;
    if (!this.clicked) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.selectedTool === "pencil" || this.selectedTool === "eraser") {
      this.currentPencilPoints.push({ x, y });
    }

    this.clearCanvas();
    this.ctx.strokeStyle = this.selectedTool === "eraser" ? "black" : this.selectedColor;

    switch (this.selectedTool) {
      case "rect":
        this.ctx.strokeRect(this.startX, this.startY, x - this.startX, y - this.startY);
        break;
      case "circle":
        const radius = Math.max(Math.abs(x - this.startX), Math.abs(y - this.startY)) / 2;
        this.ctx.beginPath();
        this.ctx.arc(this.startX + (x - this.startX) / 2, this.startY + (y - this.startY)/2, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "pencil":
      case "eraser":
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
        this.currentPencilPoints.forEach((p) => this.ctx.lineTo(p.x, p.y));
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case "triangle":
        const dx = x - this.startX;
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(this.startX - dx, y);
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
  };

  private initMouseHandlers(): void {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  private keyDownHandler = (e: KeyboardEvent) => {
    if (!this.awaitingText) return;
    if (e.key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    } else if (e.key === "Enter") {
      // will be picked up on mouseUp
    } else if (e.key.length === 1) {
      this.currentText += e.key;
    }
    this.clearCanvas();
  };

  private pushShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.socket.send(JSON.stringify({
      type: "chat",
      message: JSON.stringify({ shape }),
      roomId: this.roomId,
    }));
    this.clearCanvas();
  }
}
