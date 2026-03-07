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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../../../database/users.json");

class UserService {
    async getAllUsers() {
        return jsonStorageService.readJSON(usersPath);
    }

    async getUserById(needId: number): Promise<Pick<User, 'id' | 'name' | 'email' | 'phone' | 'created_at'>> {
        const users: User[] = await jsonStorageService.readJSON(usersPath);

        const existingUser: User | undefined = users.find((user: User) => user.id === needId);

        if (!existingUser) {
            throw new Error("User not found!");
        }

        const user: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'created_at'> = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
            created_at: existingUser.created_at
        };

        return user;
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

    async login(userData: UserDTO){
        const users: User[] = await jsonStorageService.readJSON(usersPath);

        const existingUser: User | undefined = users.find((user: User)=> user.email === userData.email);

        if (!existingUser) {
            throw new Error("User does not exist!");
        }

        if(await HashService.comparePassword(userData.password, existingUser.hashed_password)) {
            return existingUser;
        }
        else{
            throw new Error("Login or passwords do not match!");
        }
    }

    async updateUser(userId: number, data: { name?: string; email?: string; phone?: string; password?: string }): Promise<Pick<User, 'id' | 'name' | 'email' | 'phone' | 'created_at'>> {
        const users: User[] = await jsonStorageService.readJSON(usersPath);
        const index = users.findIndex((u: User) => u.id === userId);
        if (index === -1) throw new Error("User not found!");

        if (data.email !== undefined) {
            const existingByEmail = users.find((u: User) => u.email === data.email && u.id !== userId);
            if (existingByEmail) throw new Error("Email already exists!");
            users[index].email = data.email;
        }
        if (data.name !== undefined) users[index].name = data.name;
        if (data.phone !== undefined) users[index].phone = data.phone;
        if (data.password !== undefined && data.password.trim() !== "") {
            users[index].hashed_password = await HashService.hashPassword(data.password);
        }

        await jsonStorageService.writeJSON(usersPath, users);
        const { hashed_password: _, ...rest } = users[index];
        return rest;
    }
/*
    async me() {

        const users = await jsonStorageService.readJSON("users.json");
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at
        });
    }
    */ //TODOs
}

export default new UserService();
