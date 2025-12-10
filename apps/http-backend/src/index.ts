
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { rateLimit } from 'express-rate-limit'

import { prismaClient } from "@repo/db/client";
import cors from "cors";
import bcrypt from "bcrypt";
import axios from "axios";
import dotenv from "dotenv"
dotenv.config();
const app = express();

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 100, 
	standardHeaders: 'draft-8', 
	legacyHeaders: false, 
	ipv6Subnet: 56,
})
app.use(express.json());

app.use(cors());

const port = 8000;


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(limiter);

app.get("/auth/google", (req, res) => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: GOOGLE_REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    const qs = new URLSearchParams(options as any);
    // Redirect the browser to Google
    res.redirect(`${rootUrl}?${qs.toString()}`);
});

// 2. CALLBACK: Google sends user back here with ?code=...
app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code as string;

    if (!code) {
        res.redirect(`${FRONTEND_URL}/auth?error=no_code`);
        return;
    }

    try {
        // A. Exchange code for Access Token
        const { data: tokenData } = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: GOOGLE_REDIRECT_URI, 
        });

        // B. Get User Profile
        const { data: profile } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenData.access_token}`
        );

        const { id: googleId, email, name, picture } = profile;

        // C. Database Upsert
        let user = await prismaClient.user.findFirst({ where: { email } });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    email,
                    name,
                    googleId,
                    photo: picture,
                    password: null 
                }
            });
        } else if (!user.googleId) {
           
            user = await prismaClient.user.update({
                where: { id: user.id },
                data: { googleId, photo: picture }
            });
        }

        // D. Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        // E. Redirect back to Frontend with Token
        res.redirect(`${FRONTEND_URL}/?token=${token}`);

    } catch (error: any) {
        console.error("Google Auth Error:", error.response?.data || error.message);
        res.redirect(`${FRONTEND_URL}/auth?error=auth_failed`);
    }
});

// ... Keep your existing /signup, /signin, /room routes below ...
app.post("/signup", async (req: Request, res: Response) => {
    // ... existing signup code
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(parsedData.data.password, salt);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name
            }
        });
        res.json({ userId: user.id });
    } catch (e) {
        res.status(411).json({ message: "User already exists with this username" });
    }
});

app.post("/signin", async (req: Request, res: Response) => {
    // ... existing signin code
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }
    const user = await prismaClient.user.findFirst({
        where: { email: parsedData.data.username }
    });
    if (!user) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    if (!user.password) {
        res.status(403).json({ message: "Please use Google Sign-in" });
        return; 
    }
    const compare = await bcrypt.compare(parsedData.data.password, user.password);
    if (!compare) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
});

app.post("/room", middleware, async (req: Request, res: Response) => {
    // ... existing room code
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }
    const userId = (req as any).userId;
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data?.name,
                adminId: userId as string,
            },
        });
        res.json({ roomId: room.id });
    } catch (e) {
        res.status(411).json({ message: "Room already exists" });
    }
});

app.get("/chats/:roomId",middleware, async (req: Request, res: Response) => {
    // ... existing chat code
    try {
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: { roomId: roomId },
            orderBy: { id: "desc" },
            take: 1000
        });
        res.json({ messages });
    } catch (e) {
        res.json({ messages: [] });
    }
});

app.get("/room/:slug",middleware, async (req: Request, res: Response) => {
    // ... existing room slug code
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: { slug }
    });
    res.json({ room });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});