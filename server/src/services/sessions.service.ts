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
    /**
     * Creates a short-lived session for a user.
     *
     * @param currentUserId - Authenticated user ID.
     * @returns Created session record.
     */
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

    /**
     * Finds and validates a session by session ID.
     *
     * @param sid - Session identifier from cookie.
     * @returns Active session record.
     * @throws Error when the session is missing or expired.
     */
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

    /**
     * Deletes all sessions for the user represented by the session.
     *
     * @param session - Session whose user should be logged out.
     */
    async deleteSession(session: Session): Promise<void>{
         let sessions: Session[] = await JsonStorageService.readJSON(sessionsPath);

         sessions = sessions.filter(s => s.userId !== session.userId);

         await jsonStorageService.writeJSON(sessionsPath, sessions);
     }

    /**
     * Deletes a single session by session ID.
     *
     * @param sessionId - Session identifier from cookie.
     */
    async deleteSessionBySessionId(sessionId: string): Promise<void> {
        let sessions: Session[] = await JsonStorageService.readJSON(sessionsPath);
        sessions = sessions.filter(s => s.sessionId !== sessionId);
        await JsonStorageService.writeJSON(sessionsPath, sessions);
    }

}

export default new SessionsService();
