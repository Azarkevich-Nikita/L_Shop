// @ts-ignore
import jsonStorageService from "./JsonStorageService.ts";
// @ts-ignore
import type { PasswordReset } from "../types/password_resets.ts";
// @ts-ignore
import jsonStorageServiceUsers from "./JsonStorageService.ts";
// @ts-ignore
import type { User } from "../types/user.types.ts";
// @ts-ignore
import HashService from "./HashService.ts";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const passwordResetsPath = path.join(__dirname, "../../database/password_resets.json");
const usersPath = path.join(__dirname, "../../database/users.json");

class PasswordResetService {
    private readonly ttlMs: number = 10 * 60 * 1000;

    async createResetCode(email: string, code: string): Promise<PasswordReset> {
        const users: User[] = await jsonStorageServiceUsers.readJSON(usersPath);

        const existingUser: User | undefined = users.find((user: User) => user.email === email);

        if (!existingUser) {
            throw new Error("User with this email does not exist");
        }

        const resets: PasswordReset[] = await jsonStorageService.readJSON(passwordResetsPath) || [];

        const filteredResets: PasswordReset[] = resets.filter((reset: PasswordReset) => reset.email !== email);

        const newReset: PasswordReset = {
            email,
            code,
            expiresAt: Date.now() + this.ttlMs
        };

        filteredResets.push(newReset);

        await jsonStorageService.writeJSON(passwordResetsPath, filteredResets);

        return newReset;
    }

    async verifyCode(email: string, code: string): Promise<void> {
        const resets: PasswordReset[] = await jsonStorageService.readJSON(passwordResetsPath) || [];

        const reset: PasswordReset | undefined = resets.find((item: PasswordReset) => item.email === email && item.code === code);

        if (!reset) {
            throw new Error("Invalid code");
        }

        if (Date.now() > reset.expiresAt) {
            throw new Error("Code expired");
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<void> {
        const users: User[] = await jsonStorageServiceUsers.readJSON(usersPath);

        const existingUser: User | undefined = users.find((user: User) => user.email === email);

        if (!existingUser) {
            throw new Error("User with this email does not exist");
        }

        existingUser.hashed_password = await HashService.hashPassword(newPassword);

        await jsonStorageServiceUsers.writeJSON(usersPath, users);

        await this.deleteReset(email);
    }

    private async deleteReset(email: string): Promise<void> {
        const resets: PasswordReset[] = await jsonStorageService.readJSON(passwordResetsPath) || [];

        const filteredResets: PasswordReset[] = resets.filter((item: PasswordReset) => item.email !== email);

        await jsonStorageService.writeJSON(passwordResetsPath, filteredResets);
    }
}

export default new PasswordResetService();

