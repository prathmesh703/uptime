import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_TOKEN } from "./config";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if(!authorization){
        return res.status(401).json({
            error:"user not authenticated"
        })
    }
    const token = authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({
            error:"error in logging"
        })
    }
    const decoded = jwt.verify(token, JWT_TOKEN);
    if(!decoded || !decoded.sub){
        return res.status(401).json({error:"unauthorized"});
    }

    req.userId = decoded.sub as string;
    next();
}