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
}

export default new UserService();
