import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string,
  name: string,      // New: Store name in memory
  photo: string      // New: Store avatar URL in memory
}

const users: User[] = [];

// Helper to verify token and return userId
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
}

wss.on('connection', async function connection(ws, request) {
  const url = request.url;
  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token') || "";
  
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  // --- NEW: Fetch User Details from DB ---
  // We do this once on connection so we don't hammer the DB on every chat message
  const userDetails = await prismaClient.user.findUnique({
      where: { id: userId }
  });

  if (!userDetails) {
      ws.close();
      return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
    name: userDetails.name,
    photo: userDetails.photo || "" // Handle null photos
  });

  ws.on('message', async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data); 
    }

    if (parsedData.type === "join_room") {
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws);
      if (!user) {
        return;
      }
      // --- FIX: Filter Logic was inverted previously ---
      // We want to KEEP rooms that are NOT the one being left
      user.rooms = user.rooms.filter(x => x !== parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId
        }
      });

      // Find the sender to get their name/photo
      const currentUser = users.find(x => x.ws === ws);

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId,
            // --- NEW: Send sender details to frontend ---
            userId: currentUser?.userId,
            name: currentUser?.name,
            photo: currentUser?.photo
          }))
        }
      })
    }
  });
  
  // Optional: Handle disconnect to clean up memory
  ws.on('close', () => {
      const idx = users.findIndex(x => x.ws === ws);
      if (idx !== -1) {
          users.splice(idx, 1);
      }
  });

});