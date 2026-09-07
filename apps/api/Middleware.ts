import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_TOKEN } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    console.log("token", token);
    if (!token) {
        console.log("error in logging");
        res.status(401).json({ error: "error in logging" });
        return;
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    console.log(decoded);
    if (!decoded || !decoded.sub) {
        res.status(401).json({ error: "unauthorized" });
        return;
    }

    req.userId = decoded.sub as string;
    next();
}