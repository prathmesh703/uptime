import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_TOKEN } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];
    console.log("token",token);
    if(!token){
        console.log("error in logging");
        return res.status(401).json({ error:"error in logging" })
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    console.log(decoded);
    if(!decoded || !decoded.sub){
        return res.status(401).json({error:"unauthorized"});
    }

    req.userId = decoded.sub as string;
    next();
}