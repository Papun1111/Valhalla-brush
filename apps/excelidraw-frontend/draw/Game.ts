import { Tool } from "@/components/Canvas";
import { getExistingShapes, Shape, generateShapeId } from "./index";

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
  private selectedTool: Tool = "pencil";
  private selectedColor: string = "#000000";
  private strokeSize: number = 2;
  private eraserSize: number = 20;
  private currentPencilPoints: Array<{ x: number; y: number }> = [];

  // Text
  private awaitingText = false;
  private textX = 0;
  private textY = 0;
  private currentText = "";

  // Selection
  private selectedShapeIndex: number | null = null;
  private isDragging: boolean = false;
  private dragOffsetX: number = 0;
  private dragOffsetY: number = 0;

  // Eraser
  private eraserActive: boolean = false;
  private erasedDuringStroke: boolean = false;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.roomId = roomId;
    this.socket = socket;
    this.ctx = canvas.getContext("2d")!;
    this.init();
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
  // PUBLIC API
  // ==============================

  public addShape(shape: Shape): void {
    this.existingShapes.push(shape);
    this.clearCanvas();
  }

  public removeShapeById(shapeId: string): void {
    const idx = this.existingShapes.findIndex(s => s.id === shapeId);
    if (idx !== -1) {
      this.existingShapes.splice(idx, 1);
      if (this.selectedShapeIndex === idx) this.selectedShapeIndex = null;
      else if (this.selectedShapeIndex !== null && this.selectedShapeIndex > idx) {
        this.selectedShapeIndex--;
      }
      this.clearCanvas();
    }
  }

  public moveShapeById(shapeId: string, shape: Shape): void {
    const idx = this.existingShapes.findIndex(s => s.id === shapeId);
    if (idx !== -1) {
      this.existingShapes[idx] = shape;
      this.clearCanvas();
    }
  }

  public setTool(tool: Tool): void {
    this.selectedTool = tool;
    if (tool !== "text" && this.awaitingText) this.cancelText();
    if (tool !== "select") this.selectedShapeIndex = null;
    this.clearCanvas();
  }

  public setColor(color: string): void { this.selectedColor = color; }
  public setStrokeSize(size: number): void { this.strokeSize = size; }
  public setEraserSize(size: number): void { this.eraserSize = size; }
  public setShowGrid(show: boolean): void { this.showGrid = show; this.clearCanvas(); }
  public setZoom(scale: number): void { this.scale = Math.max(0.1, Math.min(5, scale)); this.clearCanvas(); }
  public getZoom(): number { return this.scale; }

  public deleteSelected(): void {
    if (this.selectedShapeIndex !== null && this.selectedShapeIndex < this.existingShapes.length) {
      const shape = this.existingShapes[this.selectedShapeIndex];
      this.existingShapes.splice(this.selectedShapeIndex, 1);
      this.selectedShapeIndex = null;
      this.saveHistory();
      this.clearCanvas();
      this.broadcastMessage({ type: "delete_shape", shapeId: shape.id });
    }
  }

  public undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.selectedShapeIndex = null;
      this.clearCanvas();
    }
  }

  public redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.existingShapes = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
      this.selectedShapeIndex = null;
      this.clearCanvas();
    }
  }

  // ==============================
  // INTERNAL INIT
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
      if (this.historyIndex >= 0) this.history[this.historyIndex] = snapshot;
      else { this.history.push(snapshot); this.historyIndex = 0; }
    }
  }

  private broadcastMessage(payload: object): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: "chat",
        message: JSON.stringify(payload),
        roomId: this.roomId,
      }));
    }
  }

  // ==============================
  // HIT-TESTING
  // ==============================

  private hitTest(x: number, y: number, shape: Shape, tolerance: number = 8): boolean {
    switch (shape.type) {
      case "rect": {
        const sx = Math.min(shape.x, shape.x + shape.width);
        const sy = Math.min(shape.y, shape.y + shape.height);
        const ex = Math.max(shape.x, shape.x + shape.width);
        const ey = Math.max(shape.y, shape.y + shape.height);
        const inside = x >= sx && x <= ex && y >= sy && y <= ey;
        const nearBorder =
          (Math.abs(x - sx) <= tolerance || Math.abs(x - ex) <= tolerance) && y >= sy - tolerance && y <= ey + tolerance ||
          (Math.abs(y - sy) <= tolerance || Math.abs(y - ey) <= tolerance) && x >= sx - tolerance && x <= ex + tolerance;
        return inside || nearBorder;
      }
      case "circle": {
        const dist = Math.sqrt((x - shape.centerX) ** 2 + (y - shape.centerY) ** 2);
        return dist <= shape.radius + tolerance;
      }
      case "line":
      case "arrow": {
        return this.distToSegment(x, y, shape.startX, shape.startY, shape.endX, shape.endY) <= tolerance;
      }
      case "pencil": {
        for (let i = 1; i < shape.points.length; i++) {
          if (this.distToSegment(x, y, shape.points[i - 1].x, shape.points[i - 1].y, shape.points[i].x, shape.points[i].y) <= tolerance + (shape.strokeSize / 2)) return true;
        }
        return false;
      }
      case "triangle": {
        const nearEdge = this.distToSegment(x, y, shape.x1, shape.y1, shape.x2, shape.y2) <= tolerance ||
          this.distToSegment(x, y, shape.x2, shape.y2, shape.x3, shape.y3) <= tolerance ||
          this.distToSegment(x, y, shape.x3, shape.y3, shape.x1, shape.y1) <= tolerance;
        const inside = this.pointInTriangle(x, y, shape.x1, shape.y1, shape.x2, shape.y2, shape.x3, shape.y3);
        return nearEdge || inside;
      }
      case "text": {
        this.ctx.font = shape.font;
        const textWidth = this.ctx.measureText(shape.text).width;
        return x >= shape.x - 4 && x <= shape.x + textWidth + 4 && y >= shape.y - 20 && y <= shape.y + 4;
      }
      case "diamond": {
        // Point-in-diamond (rotated rect)
        const dx = Math.abs(x - shape.cx) / (shape.width / 2);
        const dy = Math.abs(y - shape.cy) / (shape.height / 2);
        return (dx + dy) <= 1.0 + (tolerance / Math.max(shape.width, shape.height));
      }
      case "star": {
        const dist = Math.sqrt((x - shape.cx) ** 2 + (y - shape.cy) ** 2);
        return dist <= shape.outerRadius + tolerance;
      }
    }
    return false;
  }

  private distToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = Math.max(0, Math.min(1, t));
    return Math.sqrt((px - (x1 + t * dx)) ** 2 + (py - (y1 + t * dy)) ** 2);
  }

  private pointInTriangle(px: number, py: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): boolean {
    const d1 = (px - x2) * (y1 - y2) - (x1 - x2) * (py - y2);
    const d2 = (px - x3) * (y2 - y3) - (x2 - x3) * (py - y3);
    const d3 = (px - x1) * (y3 - y1) - (x3 - x1) * (py - y1);
    return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
  }

  private findShapeAt(x: number, y: number): number | null {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      if (this.hitTest(x, y, this.existingShapes[i])) return i;
    }
    return null;
  }

  // ==============================
  // SHAPE TRANSLATION
  // ==============================

  private translateShape(shape: Shape, dx: number, dy: number): Shape {
    const s = JSON.parse(JSON.stringify(shape)) as Shape;
    switch (s.type) {
      case "rect": s.x += dx; s.y += dy; break;
      case "circle": s.centerX += dx; s.centerY += dy; break;
      case "line":
      case "arrow": s.startX += dx; s.startY += dy; s.endX += dx; s.endY += dy; break;
      case "pencil": s.points = s.points.map(p => ({ x: p.x + dx, y: p.y + dy })); break;
      case "triangle": s.x1 += dx; s.y1 += dy; s.x2 += dx; s.y2 += dy; s.x3 += dx; s.y3 += dy; break;
      case "text": s.x += dx; s.y += dy; break;
      case "diamond": s.cx += dx; s.cy += dy; break;
      case "star": s.cx += dx; s.cy += dy; break;
    }
    return s;
  }

  // ==============================
  // SELECTION RENDERING
  // ==============================

  private getShapeBounds(shape: Shape): { x: number; y: number; w: number; h: number } {
    switch (shape.type) {
      case "rect":
        return { x: Math.min(shape.x, shape.x + shape.width), y: Math.min(shape.y, shape.y + shape.height), w: Math.abs(shape.width), h: Math.abs(shape.height) };
      case "circle":
        return { x: shape.centerX - shape.radius, y: shape.centerY - shape.radius, w: shape.radius * 2, h: shape.radius * 2 };
      case "line":
      case "arrow":
        return { x: Math.min(shape.startX, shape.endX), y: Math.min(shape.startY, shape.endY), w: Math.abs(shape.endX - shape.startX) || 1, h: Math.abs(shape.endY - shape.startY) || 1 };
      case "pencil": {
        const xs = shape.points.map(p => p.x); const ys = shape.points.map(p => p.y);
        const minX = Math.min(...xs); const minY = Math.min(...ys);
        return { x: minX, y: minY, w: (Math.max(...xs) - minX) || 1, h: (Math.max(...ys) - minY) || 1 };
      }
      case "triangle": {
        const minX = Math.min(shape.x1, shape.x2, shape.x3); const minY = Math.min(shape.y1, shape.y2, shape.y3);
        return { x: minX, y: minY, w: (Math.max(shape.x1, shape.x2, shape.x3) - minX) || 1, h: (Math.max(shape.y1, shape.y2, shape.y3) - minY) || 1 };
      }
      case "text": {
        this.ctx.font = shape.font;
        return { x: shape.x, y: shape.y - 16, w: this.ctx.measureText(shape.text).width, h: 20 };
      }
      case "diamond":
        return { x: shape.cx - shape.width / 2, y: shape.cy - shape.height / 2, w: shape.width, h: shape.height };
      case "star":
        return { x: shape.cx - shape.outerRadius, y: shape.cy - shape.outerRadius, w: shape.outerRadius * 2, h: shape.outerRadius * 2 };
    }
  }

  private drawSelectionBox(shape: Shape): void {
    const bounds = this.getShapeBounds(shape);
    const pad = 6;
    this.ctx.save();
    this.ctx.strokeStyle = "#5b5bd6";
    this.ctx.lineWidth = 1.5 / this.scale;
    this.ctx.setLineDash([6 / this.scale, 4 / this.scale]);
    this.ctx.strokeRect(bounds.x - pad, bounds.y - pad, bounds.w + pad * 2, bounds.h + pad * 2);
    this.ctx.setLineDash([]);
    // Corner handles
    const hs = 6 / this.scale;
    this.ctx.fillStyle = "#ffffff";
    this.ctx.strokeStyle = "#5b5bd6";
    this.ctx.lineWidth = 1.5 / this.scale;
    for (const [cx, cy] of [
      [bounds.x - pad, bounds.y - pad],
      [bounds.x + bounds.w + pad, bounds.y - pad],
      [bounds.x - pad, bounds.y + bounds.h + pad],
      [bounds.x + bounds.w + pad, bounds.y + bounds.h + pad],
    ]) {
      this.ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
      this.ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
    }
    this.ctx.restore();
  }

  // ==============================
  // RENDERING
  // ==============================

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
    this.existingShapes.forEach(shape => this.drawShape(shape));

    if (this.selectedShapeIndex !== null && this.selectedShapeIndex < this.existingShapes.length) {
      this.drawSelectionBox(this.existingShapes[this.selectedShapeIndex]);
    }

    if (this.awaitingText && this.currentText) {
      this.ctx.font = "16px sans-serif";
      this.ctx.fillStyle = this.selectedColor;
      this.ctx.fillText(this.currentText + "▏", this.textX, this.textY);
    }

    this.ctx.restore();

    if (this.selectedTool === "eraser" && this.eraserActive) {
      this.drawEraserCursor();
    }
  }

  private drawEraserCursor(): void {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.strokeStyle = "#999";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([3, 3]);
    this.ctx.beginPath();
    this.ctx.arc(this.lastMouseX, this.lastMouseY, this.eraserSize * this.scale, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
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
          shape.points.forEach(p => this.ctx.lineTo(p.x, p.y));
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
      case "arrow":
        this.drawArrow(shape.startX, shape.startY, shape.endX, shape.endY, shape.strokeSize);
        break;
      case "text":
        this.ctx.font = shape.font;
        this.ctx.fillText(shape.text, shape.x, shape.y);
        break;
      case "diamond":
        this.drawDiamond(shape.cx, shape.cy, shape.width, shape.height);
        break;
      case "star":
        this.drawStar(shape.cx, shape.cy, shape.outerRadius, shape.innerRadius);
        break;
    }
  }

  private drawArrow(sx: number, sy: number, ex: number, ey: number, strokeSize: number): void {
    const headLen = Math.max(15, strokeSize * 4);
    const angle = Math.atan2(ey - sy, ex - sx);
    // Shaft
    this.ctx.beginPath();
    this.ctx.moveTo(sx, sy);
    this.ctx.lineTo(ex, ey);
    this.ctx.stroke();
    // Arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(ex, ey);
    this.ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(ex, ey);
    this.ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  private drawDiamond(cx: number, cy: number, w: number, h: number): void {
    const hw = w / 2;
    const hh = h / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - hh);
    this.ctx.lineTo(cx + hw, cy);
    this.ctx.lineTo(cx, cy + hh);
    this.ctx.lineTo(cx - hw, cy);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawStar(cx: number, cy: number, outerR: number, innerR: number): void {
    const points = 5;
    this.ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI / points) * i - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  // ==============================
  // COORDINATE HELPERS
  // ==============================

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

  private getScreenCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    if (window.TouchEvent && e instanceof TouchEvent) {
      const touch = e.touches[0] || e.changedTouches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
  }

  // ==============================
  // EVENT HANDLERS
  // ==============================

  private handleStart(e: MouseEvent | TouchEvent): void {
    const { x, y } = this.getWorldCoordinates(e);
    const screen = this.getScreenCoordinates(e);

    // Panning
    if (this.selectedTool === "hand" || (e instanceof MouseEvent && e.button === 1)) {
      this.isPanning = true;
      this.lastMouseX = screen.x; this.lastMouseY = screen.y;
      return;
    }

    // Select
    if (this.selectedTool === "select") {
      const hitIndex = this.findShapeAt(x, y);
      if (hitIndex !== null) {
        this.selectedShapeIndex = hitIndex;
        this.isDragging = true;
        this.dragOffsetX = x; this.dragOffsetY = y;
      } else {
        this.selectedShapeIndex = null;
        this.isDragging = false;
      }
      this.clearCanvas();
      return;
    }

    // Eraser
    if (this.selectedTool === "eraser") {
      this.eraserActive = true;
      this.erasedDuringStroke = false;
      this.lastMouseX = screen.x; this.lastMouseY = screen.y;
      this.eraseAt(x, y);
      return;
    }

    // Text
    if (this.selectedTool === "text") {
      if (this.awaitingText && this.currentText) this.finalizeText();
      this.awaitingText = true; this.textX = x; this.textY = y; this.currentText = "";
      window.addEventListener("keydown", this.keyDownHandler);
      this.clearCanvas();
      return;
    }

    // Drawing tools
    this.clicked = true; this.startX = x; this.startY = y;
    if (this.selectedTool === "pencil") {
      this.currentPencilPoints = [{ x, y }];
    }
  }

  private handleMove(e: MouseEvent | TouchEvent): void {
    const screen = this.getScreenCoordinates(e);

    if (this.isPanning) {
      this.panX += screen.x - this.lastMouseX; this.panY += screen.y - this.lastMouseY;
      this.lastMouseX = screen.x; this.lastMouseY = screen.y;
      this.clearCanvas();
      return;
    }

    if (this.selectedTool === "select" && this.isDragging && this.selectedShapeIndex !== null) {
      const { x, y } = this.getWorldCoordinates(e);
      const dx = x - this.dragOffsetX; const dy = y - this.dragOffsetY;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        this.existingShapes[this.selectedShapeIndex] = this.translateShape(this.existingShapes[this.selectedShapeIndex], dx, dy);
        this.dragOffsetX = x; this.dragOffsetY = y;
        this.clearCanvas();
      }
      return;
    }

    if (this.selectedTool === "eraser" && this.eraserActive) {
      const { x, y } = this.getWorldCoordinates(e);
      this.lastMouseX = screen.x; this.lastMouseY = screen.y;
      this.eraseAt(x, y);
      return;
    }

    if (this.selectedTool === "eraser") {
      this.lastMouseX = screen.x; this.lastMouseY = screen.y;
    }

    if (this.selectedTool === "text" || !this.clicked) return;
    const { x, y } = this.getWorldCoordinates(e);

    if (this.selectedTool === "pencil") {
      this.currentPencilPoints.push({ x, y });
    }

    this.clearCanvas();

    // Live preview
    this.ctx.save();
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.fillStyle = this.selectedColor;
    this.ctx.lineWidth = this.strokeSize;
    this.ctx.lineCap = "round"; this.ctx.lineJoin = "round";

    const dx = x - this.startX; const dy = y - this.startY;

    switch (this.selectedTool) {
      case "rect":
        this.ctx.strokeRect(this.startX, this.startY, dx, dy);
        break;
      case "circle": {
        const r = Math.sqrt(dx * dx + dy * dy) / 2;
        this.ctx.beginPath(); this.ctx.arc(this.startX + dx / 2, this.startY + dy / 2, r, 0, Math.PI * 2); this.ctx.stroke();
        break;
      }
      case "pencil":
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
      case "arrow":
        this.drawArrow(this.startX, this.startY, x, y, this.strokeSize);
        break;
      case "diamond": {
        const cx = (this.startX + x) / 2;
        const cy = (this.startY + y) / 2;
        this.drawDiamond(cx, cy, Math.abs(dx), Math.abs(dy));
        break;
      }
      case "star": {
        const cx = (this.startX + x) / 2;
        const cy = (this.startY + y) / 2;
        const outerR = Math.sqrt(dx * dx + dy * dy) / 2;
        this.drawStar(cx, cy, outerR, outerR * 0.4);
        break;
      }
    }
    this.ctx.restore();
  }

  private handleEnd(e: MouseEvent | TouchEvent): void {
    if (this.isPanning) { this.isPanning = false; return; }

    if (this.selectedTool === "select" && this.isDragging && this.selectedShapeIndex !== null) {
      this.isDragging = false;
      this.saveHistory();
      const movedShape = this.existingShapes[this.selectedShapeIndex];
      this.broadcastMessage({ type: "move_shape", shapeId: movedShape.id, shape: movedShape });
      this.clearCanvas();
      return;
    }

    if (this.selectedTool === "eraser") {
      if (this.erasedDuringStroke) this.saveHistory();
      this.eraserActive = false;
      this.clearCanvas();
      return;
    }

    if (this.selectedTool === "text" || !this.clicked) return;
    this.clicked = false;
    const { x, y } = this.getWorldCoordinates(e);
    const dx = x - this.startX; const dy = y - this.startY;

    let shape: Shape | null = null;
    const color = this.selectedColor;
    const strokeSize = this.strokeSize;
    const id = generateShapeId();

    switch (this.selectedTool) {
      case "rect":
        if (Math.abs(dx) > 1 && Math.abs(dy) > 1)
          shape = { type: "rect", id, x: this.startX, y: this.startY, width: dx, height: dy, color, strokeSize };
        break;
      case "circle": {
        const r = Math.sqrt(dx * dx + dy * dy) / 2;
        if (r > 1)
          shape = { type: "circle", id, centerX: this.startX + dx / 2, centerY: this.startY + dy / 2, radius: r, color, strokeSize };
        break;
      }
      case "pencil":
        if (this.currentPencilPoints.length > 1)
          shape = { type: "pencil", id, points: [...this.currentPencilPoints], color, strokeSize };
        break;
      case "triangle":
        if (Math.abs(dx) > 1 && Math.abs(dy) > 1)
          shape = { type: "triangle", id, x1: this.startX, y1: this.startY, x2: x, y2: y, x3: this.startX - dx, y3: y, color, strokeSize };
        break;
      case "line":
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1)
          shape = { type: "line", id, startX: this.startX, startY: this.startY, endX: x, endY: y, color, strokeSize };
        break;
      case "arrow":
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1)
          shape = { type: "arrow", id, startX: this.startX, startY: this.startY, endX: x, endY: y, color, strokeSize };
        break;
      case "diamond": {
        if (Math.abs(dx) > 1 && Math.abs(dy) > 1)
          shape = { type: "diamond", id, cx: (this.startX + x) / 2, cy: (this.startY + y) / 2, width: Math.abs(dx), height: Math.abs(dy), color, strokeSize };
        break;
      }
      case "star": {
        const outerR = Math.sqrt(dx * dx + dy * dy) / 2;
        if (outerR > 3)
          shape = { type: "star", id, cx: (this.startX + x) / 2, cy: (this.startY + y) / 2, outerRadius: outerR, innerRadius: outerR * 0.4, color, strokeSize };
        break;
      }
    }

    if (shape) this.pushShape(shape);
    this.currentPencilPoints = [];
    this.clearCanvas();
  }

  private eraseAt(x: number, y: number): void {
    for (let i = this.existingShapes.length - 1; i >= 0; i--) {
      if (this.hitTest(x, y, this.existingShapes[i], this.eraserSize)) {
        const shape = this.existingShapes[i];
        this.existingShapes.splice(i, 1);
        this.erasedDuringStroke = true;
        this.broadcastMessage({ type: "delete_shape", shapeId: shape.id });
        if (this.selectedShapeIndex !== null) {
          if (this.selectedShapeIndex === i) this.selectedShapeIndex = null;
          else if (this.selectedShapeIndex > i) this.selectedShapeIndex--;
        }
      }
    }
    this.clearCanvas();
  }

  private pushShape(shape: Shape) {
    this.existingShapes.push(shape);
    this.saveHistory();
    this.broadcastMessage({ shape });
  }

  // ==============================
  // TEXT HANDLING
  // ==============================

  private keyDownHandler = (e: KeyboardEvent) => {
    if (!this.awaitingText) return;
    if (e.key === "Backspace") { this.currentText = this.currentText.slice(0, -1); e.preventDefault(); }
    else if (e.key === "Enter") this.finalizeText();
    else if (e.key === "Escape") this.cancelText();
    else if (e.key.length === 1) this.currentText += e.key;
    this.clearCanvas();
  };

  private finalizeText(): void {
    if (this.currentText.trim())
      this.pushShape({ type: "text", id: generateShapeId(), x: this.textX, y: this.textY, text: this.currentText, color: this.selectedColor, font: "16px sans-serif" });
    this.cancelText();
  }

  private cancelText(): void {
    this.awaitingText = false;
    window.removeEventListener("keydown", this.keyDownHandler);
    this.currentText = "";
    this.clearCanvas();
  }

  // ==============================
  // ZOOM
  // ==============================

  private wheelHandler = (e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const oldScale = this.scale;
    const newScale = Math.max(0.1, Math.min(5, oldScale + delta));
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top;
    const worldX = (mouseX - this.panX) / oldScale; const worldY = (mouseY - this.panY) / oldScale;
    this.panX = mouseX - worldX * newScale; this.panY = mouseY - worldY * newScale;
    this.scale = newScale;
    this.clearCanvas();
  }

  // ==============================
  // LISTENER BINDING
  // ==============================

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