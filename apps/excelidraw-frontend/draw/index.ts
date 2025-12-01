import { HTTP_BACKEND } from "@/config";
import axios from "axios";

// 1. Centralized Shape Definition
// This ensures your Backend, Game engine, and API helpers all agree on what a "Shape" looks like.
export type Shape =
  | { 
      type: "rect"; 
      x: number; 
      y: number; 
      width: number; 
      height: number; 
      color: string;
      strokeSize: number;
    }
  | { 
      type: "circle"; 
      centerX: number; 
      centerY: number; 
      radius: number; 
      color: string;
      strokeSize: number;
    }
  | { 
      type: "pencil"; 
      points: { x: number; y: number }[]; 
      color: string;
      strokeSize: number;
    }
  | { 
      type: "line"; 
      startX: number; 
      startY: number; 
      endX: number; 
      endY: number; 
      color: string;
      strokeSize: number;
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
      strokeSize: number;
    }
  | { 
      type: "text"; 
      x: number; 
      y: number; 
      text: string; 
      color: string; 
      font: string; 
    };

// 2. API Helper
export async function getExistingShapes(roomId: string): Promise<Shape[]> {
    try {
        const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
        const messages = res.data.messages;

        const shapes = messages.map((x: { message: string }) => {
            const messageData = JSON.parse(x.message);
            return messageData.shape;
        });

        return shapes;
    } catch (e) {
        console.error("Error fetching existing shapes:", e);
        return [];
    }
}