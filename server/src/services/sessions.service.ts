//@ts-ignore
import type { Session } from "../../types/session.types.ts";
//@ts-ignore
import jsonStorageService from "./JsonStorageService.ts";

import {fileURLToPath} from "url";
import path from "path";

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
}

export default new SessionsService();
