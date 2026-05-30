//@ts-ignore
import type { Session } from "../../types/session.types.ts";
//@ts-ignore
import jsonStorageService from "./JsonStorageService.ts";

import {fileURLToPath} from "url";
import path from "path";
//@ts-ignore
import JsonStorageService from "./JsonStorageService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionsPath = path.join(__dirname, "../../database/sessions.json");


class SessionsService {
    async createSession(currentUserId: number): Promise<Session> {
        const sessions: Session[] = await jsonStorageService.readJSON(sessionsPath);

        const newSession: Session = {
            sessionId: crypto.randomUUID(),
            userId: currentUserId,
            expiresAt: Date.now() + 10 * 60 * 1000
        };

        sessions.push(newSession);

        await jsonStorageService.writeJSON(sessionsPath, sessions);

        return newSession;
    }

    async getSessionInfoBySessionId(sid: string): Promise<Session> {
        const sessions: Session[] = await jsonStorageService.readJSON(sessionsPath);
        const session = sessions.find(s => s.sessionId === sid);

        if (!session) {
            throw Error("Session not found");
        }

        if (Date.now() > session.expiresAt) {
            throw Error("Session expired");
        }

        return session;
    }

    async deleteSession(session: Session): Promise<void>{
         let sessions: Session[] = await JsonStorageService.readJSON(sessionsPath);

         sessions = sessions.filter(s => s.userId !== session.userId);

         await jsonStorageService.writeJSON(sessionsPath, sessions);
     }

}

export default new SessionsService();
