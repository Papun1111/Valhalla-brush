import { HTTP_BACKEND } from "@/config";
import axios from "axios";

// Unique ID generator
export function generateShapeId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Centralized Shape Definition
// Every shape has a unique `id` for stable identification across clients

export type Shape =
  | {
      type: "rect";
      id: string;
      x: number;
      y: number;
      width: number;
      height: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "circle";
      id: string;
      centerX: number;
      centerY: number;
      radius: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "pencil";
      id: string;
      points: { x: number; y: number }[];
      color: string;
      strokeSize: number;
    }
  | {
      type: "line";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "triangle";
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      x3: number;
      y3: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "text";
      id: string;
      x: number;
      y: number;
      text: string;
      color: string;
      font: string;
    }
  | {
      type: "arrow";
      id: string;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "diamond";
      id: string;
      cx: number;
      cy: number;
      width: number;
      height: number;
      color: string;
      strokeSize: number;
    }
  | {
      type: "star";
      id: string;
      cx: number;
      cy: number;
      outerRadius: number;
      innerRadius: number;
      color: string;
      strokeSize: number;
    };

// Message types stored in chat history
type ChatMessage =
  | { shape: Shape }                                    // shape added
  | { type: "delete_shape"; shapeId: string }           // shape deleted
  | { type: "move_shape"; shapeId: string; shape: Shape }; // shape moved

/**
 * Fetches all chat messages for a room and REPLAYS the full history
 * to reconstruct the current canvas state.
 * This correctly handles add, delete, and move operations.
 */
export async function getExistingShapes(roomId: string): Promise<Shape[]> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("authorization") : null;
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: token ? { authorization: token } : {},
    });
    const messages = res.data.messages;

    // Messages come in descending order (newest first), reverse for replay
    const orderedMessages = [...messages].reverse();

    // Replay all messages to build current state
    const shapesMap = new Map<string, Shape>();
    const shapesOrder: string[] = []; // track insertion order

    for (const msg of orderedMessages) {
      try {
        const parsed: ChatMessage = JSON.parse(msg.message);

        if ("shape" in parsed && parsed.shape) {
          const shape = parsed.shape;
          // Assign an id if missing (legacy data)
          if (!shape.id) {
            shape.id = generateShapeId();
          }
          shapesMap.set(shape.id, shape);
          shapesOrder.push(shape.id);
        } else if ("type" in parsed && parsed.type === "delete_shape" && parsed.shapeId) {
          shapesMap.delete(parsed.shapeId);
        } else if ("type" in parsed && parsed.type === "move_shape" && parsed.shapeId && parsed.shape) {
          if (shapesMap.has(parsed.shapeId)) {
            shapesMap.set(parsed.shapeId, parsed.shape);
          }
        }
      } catch {
        // Skip malformed messages
      }
    }

    // Reconstruct in insertion order, skipping deleted
    const result: Shape[] = [];
    const seen = new Set<string>();
    for (const id of shapesOrder) {
      if (shapesMap.has(id) && !seen.has(id)) {
        result.push(shapesMap.get(id)!);
        seen.add(id);
      }
    }

    return result;
  } catch (e) {
    console.error("Error fetching existing shapes:", e);
    return [];
  }
}