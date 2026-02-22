import type { Request, Response, NextFunction } from "express";
//@ts-ignore
import type {Session} from "../types/session.types.ts";
//@ts-ignore
import JsonStorageService from "../services/JsonStorageService.ts";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionsPath = path.join(__dirname, "../../database/sessions.json");


export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    const sid = req.cookies.currSid;

    if(!sid) {
        return res.status(401).json({error: "Not logged in"});
    }

    const sessions: Session[] = await JsonStorageService.readJSON(sessionsPath);
    console.log(sessions);
    const session = sessions.find(s => s.sessionId === sid);

    if (!session) {
        return res.status(401).json({error: "Not logged in"});
    }

    if(session.expiresAt < Date.now()) {
        return res.status(401).json({error: "Session expired"});
    }

    next();
}