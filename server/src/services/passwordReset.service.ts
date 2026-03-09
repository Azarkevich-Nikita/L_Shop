//@ts-ignore
import jsonStorageService from "./JsonStorageService.ts";
import path from "path";
import { fileURLToPath } from "url";

type PasswordResetRecord = {
    email: string;
    code: string;
    createdAt: number;
    expiresAt: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resetsPath = path.join(__dirname, "../../database/password_resets.json");

class PasswordResetService {
    private async readAll(): Promise<PasswordResetRecord[]> {
        const data = await jsonStorageService.readJSON(resetsPath);
        return Array.isArray(data) ? (data as PasswordResetRecord[]) : [];
    }

    private async writeAll(records: PasswordResetRecord[]): Promise<void> {
        await jsonStorageService.writeJSON(resetsPath, records);
    }

    async create(email: string, ttlMs: number = 15 * 60 * 1000): Promise<string> {
        const records = await this.readAll();
        const filtered = records.filter((r) => r.email !== email);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        filtered.push({
            email,
            code,
            createdAt: Date.now(),
            expiresAt: Date.now() + ttlMs,
        });
        await this.writeAll(filtered);
        return code;
    }

    async verify(email: string, code: string): Promise<boolean> {
        const records = await this.readAll();
        const record = records.find((r) => r.email === email);
        if (!record) return false;
        if (record.expiresAt < Date.now()) {
            await this.consume(email);
            return false;
        }
        return record.code === code;
    }

    async consume(email: string): Promise<void> {
        const records = await this.readAll();
        const filtered = records.filter((r) => r.email !== email);
        await this.writeAll(filtered);
    }
}

export default new PasswordResetService();

