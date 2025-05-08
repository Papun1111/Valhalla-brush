import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
      color: string;
    }
  | {
      type: "pencil";
      points: Array<{ x: number; y: number }>;
      color: string;
    }
  | {
      type: "triangle";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x3: number;
      y3: number;
      color: string;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
    };

export class Game {
  private existingShapes: Shape[] = [];
  private clicked = false;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "circle";
  private selectedColor: string = "#FFFFFF"; // Default color: white
  private currentPencilPoints: Array<{ x: number; y: number }> = [];

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
  }

  public setTool(tool: Tool): void {
    this.selectedTool = tool;
  }

  public setColor(color: string): void {
    this.selectedColor = color;
  }

  private async init(): Promise<void> {
    this.existingShapes = await getExistingShapes(this.roomId);
    console.log(this.existingShapes);
    this.clearCanvas();
  }

  private initHandlers(): void {
    this.socket.onmessage = (event: MessageEvent): void => {
      const message = JSON.parse(event.data) as { type: string; message: string };
      if (message.type === "chat") {
        const { shape } = JSON.parse(message.message) as { shape: Shape };
        this.existingShapes.push(shape);
        this.clearCanvas();
      }
    };
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = shape.color || "white";

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          Math.abs(shape.radius),
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "pencil" && shape.points.length > 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.points[0].x, shape.points[0].y);
        
        for (let i = 1; i < shape.points.length; i++) {
          this.ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "triangle") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.x1, shape.y1);
        this.ctx.lineTo(shape.x2, shape.y2);
        this.ctx.lineTo(shape.x3, shape.y3);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }

  private mouseDownHandler = (e: MouseEvent): void => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    
    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x: e.clientX, y: e.clientY }];
    }
  };

  private mouseUpHandler = (e: MouseEvent): void => {
    if (!this.clicked) return;
    
    this.clicked = false;
    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    let shape: Shape | null = null;
    
    if (this.selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
        color: this.selectedColor,
      };
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        centerX: this.startX + (width / 2),
        centerY: this.startY + (height / 2),
        radius,
        color: this.selectedColor,
      };
    } else if (this.selectedTool === "pencil") {
      // Only send pencil shape if we have points
      if (this.currentPencilPoints.length > 1) {
        shape = {
          type: "pencil",
          points: [...this.currentPencilPoints],
          color: this.selectedColor,
        };
      }
    } else if (this.selectedTool === "triangle") {
      // Create a triangle based on start point and mouse position
      const thirdPointX = this.startX - (e.clientX - this.startX); // Creates an isosceles triangle
      
      shape = {
        type: "triangle",
        x1: this.startX,
        y1: this.startY,
        x2: e.clientX,
        y2: e.clientY,
        x3: thirdPointX,
        y3: e.clientY,
        color: this.selectedColor,
      };
    } else if (this.selectedTool === "line") {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: e.clientX,
        endY: e.clientY,
        color: this.selectedColor,
      };
    }

    if (!shape) return;

    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({ shape }),
        roomId: this.roomId,
      })
    );

    // Reset pencil points after sending
    this.currentPencilPoints = [];
  };

  private mouseMoveHandler = (e: MouseEvent): void => {
    if (!this.clicked) return;

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    // For pencil tool, add the current point to our points array
    if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x: e.clientX, y: e.clientY });
    }

    this.clearCanvas();
    this.ctx.strokeStyle = this.selectedColor;

    if (this.selectedTool === "rect") {
      this.ctx.strokeRect(this.startX, this.startY, width, height);
    } else if (this.selectedTool === "circle") {
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      const centerX = this.startX + (width / 2);
      const centerY = this.startY + (height / 2);

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, Math.abs(radius), 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "pencil" && this.currentPencilPoints.length > 0) {
      // Draw the current pencil stroke
      this.ctx.beginPath();
      this.ctx.moveTo(this.currentPencilPoints[0].x, this.currentPencilPoints[0].y);
      
      for (let i = 1; i < this.currentPencilPoints.length; i++) {
        this.ctx.lineTo(this.currentPencilPoints[i].x, this.currentPencilPoints[i].y);
      }
      
      this.ctx.stroke();
      this.ctx.closePath();
    } else if (this.selectedTool === "triangle") {
      // Preview the triangle
      const thirdPointX = this.startX - (e.clientX - this.startX);
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.lineTo(thirdPointX, e.clientY);
      this.ctx.closePath();
      this.ctx.stroke();
    } else if (this.selectedTool === "line") {
      // Preview the line
      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.stroke();
      this.ctx.closePath();
    }
  };

  private initMouseHandlers(): void {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
}