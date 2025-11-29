import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

// 1. Define the shape of your JWT payload
interface AuthPayload extends JwtPayload {
    userId: string;
}

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    try {
        // 2. Verify throws an error if invalid, so we wrap in try/catch
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

        // 3. Attach userId to the request object
        // We cast 'req' to 'any' here to allow adding a custom property
        // without complex global type declaration files.
        if (decoded.userId) {
            (req as any).userId = decoded.userId;
            next();
        } else {
            res.status(403).json({
                message: "Unauthorized"
            });
        }
    } catch (e) {
        // 4. If token is expired or invalid, return 403 instead of crashing
        res.status(403).json({
            message: "Unauthorized"
        });
    }
}