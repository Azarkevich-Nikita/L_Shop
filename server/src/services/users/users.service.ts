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

type PublicUser = Pick<User, "id" | "name" | "email" | "phone" | "created_at">;
type UserUpdateData = Partial<Pick<UserDTO, "name" | "email" | "phone" | "password">>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../../../database/users.json");

class UserService {
    /**
     * Reads all users from the JSON storage.
     *
     * @returns Full user records, including password hashes.
     */
    async getAllUsers() {
        return (await jsonStorageService.readJSON(usersPath)) ?? [];
    }

    /**
     * Finds a user by email.
     *
     * @param email - User email.
     * @returns Matching user record.
     * @throws Error when no user has this email.
     */
    async getUserByEmail(email: string): Promise<User> {
        const users: User[] = (await jsonStorageService.readJSON(usersPath)) ?? [];
        const existingUser: User | undefined = users.find((user: User) => user.email === email);
        if (!existingUser) {
            throw new Error("User not found!");
        }
        return existingUser;
    }

    /**
     * Returns public profile data for a user.
     *
     * @param needId - User ID from the current session.
     * @returns User data without password hash.
     * @throws Error when the user does not exist.
     */
    async getUserById(needId: number): Promise<PublicUser> {
        const users: User[] = (await jsonStorageService.readJSON(usersPath)) ?? [];

        const existingUser: User | undefined = users.find((user: User) => user.id === needId);

        if (!existingUser) {
            throw new Error("User not found!");
        }

        const user: PublicUser = {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
            created_at: existingUser.created_at
        };

        return user;
    }

    /**
     * Creates a new user and stores a hashed password.
     *
     * @param userData - Registration form data.
     * @returns Created user record.
     * @throws Error when the email is already used.
     */
    async register(userData: UserDTO): Promise<User> {
        const users: User[] = (await jsonStorageService.readJSON(usersPath)) ?? [];

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

    /**
     * Validates user credentials.
     *
     * @param userData - Login data containing email and password.
     * @returns Authenticated user record.
     * @throws Error when the user does not exist or password is invalid.
     */
    async login(userData: UserDTO){
        const users: User[] = (await jsonStorageService.readJSON(usersPath)) ?? [];

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

    /**
     * Updates profile fields for an existing user.
     *
     * @param userId - User ID from the current session.
     * @param userData - Partial profile data; password is hashed before saving.
     * @returns Updated public user profile.
     * @throws Error when the user does not exist or email is already used.
     */
    async updateUser(userId: number, userData: UserUpdateData): Promise<PublicUser> {
        const users: User[] = (await jsonStorageService.readJSON(usersPath)) ?? [];
        const existingUser = users.find((user: User) => user.id === userId);

        if (!existingUser) {
            throw new Error("User not found!");
        }

        if (userData.email && userData.email !== existingUser.email) {
            const emailOwner = users.find((user: User) => user.email === userData.email);
            if (emailOwner) {
                throw new Error("Email already exists!");
            }
            existingUser.email = userData.email;
        }

        if (userData.name !== undefined) {
            existingUser.name = userData.name;
        }
        if (userData.phone !== undefined) {
            existingUser.phone = userData.phone;
        }
        if (userData.password) {
            existingUser.hashed_password = await HashService.hashPassword(userData.password);
        }

        await jsonStorageService.writeJSON(usersPath, users);

        return {
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            phone: existingUser.phone,
            created_at: existingUser.created_at
        };
    }
}

export default new UserService();
