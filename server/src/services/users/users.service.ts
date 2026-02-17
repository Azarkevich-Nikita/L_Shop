// @ts-ignore
import HashService from "../HashService.ts";
//@ts-ignore
import jsonStorageService from "../JsonStorageService.ts";
import path from "path";
import { fileURLToPath } from "url";
//@ts-ignore
import type { User } from "../../types/user.types.ts"
//@ts-ignore
import type { UserDTO } from "../../DTO/UserDTO.ts";

import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../../../database/users.json");

class UserService {
    async getAllUsers() {
        return jsonStorageService.readJSON(usersPath);
    }

    async register(userData: UserDTO): Promise<User> {
        const users: User[] = await jsonStorageService.readJSON(usersPath);

        const existingUser: User | undefined = users.find((user: User) => user.email === userData.email);

        if (existingUser) {
            throw new Error("Email already exists!");
        }

        const newUser: User = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            hashed_password: await HashService.hashPassword(userData.password),
            created_at: new Date().toISOString().slice(0, 10)
        };

        users.push(newUser);
        await jsonStorageService.writeJSON(usersPath, users);
        return newUser;
    }

}

export default new UserService();
