import type { Request, Response } from "express";
// @ts-ignore
import userService from "../../services/users/users.service.ts";
// @ts-ignore
import sessionService from "../../services/sessions.service.ts";
// @ts-ignore
import sessionsService from "../../services/sessions.service.ts";
// @ts-ignore
import UsersService from "../../services/users/users.service.ts";
// @ts-ignore
import type { User } from "../models/users.model.ts";
// @ts-ignore
import type { Session } from "../../types/session.types.ts";
// @ts-ignore
import passwordResetService from "../../services/passwordReset.service.ts";
// @ts-ignore
import emailService from "../../services/email.service.ts";
// @ts-ignore
import { generateCode } from "../../utils/code.ts";

class userController {
    async getAll(req: Request, res: Response): Promise<void> {
        res.status(200).json(await userService.getAllUsers());
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const newUser: User = await userService.register(req.body);

            const session: Session = await sessionService.createSession(newUser.id);

            res.cookie("currSid", session.sessionId, {
                httpOnly: true,
                maxAge: 600_000
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const user: User = await UsersService.login(req.body);

            const session: Session = await sessionsService.createSession(user.id);

            res.cookie("currSid", session.sessionId, {
                httpOnly: true,
                maxAge: 600_000
            });

            res.status(201).json({ message: "User login successfully" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async me(req: Request, res: Response): Promise<void> {
        try {
            if (!req.userId) {
                throw Error("No user_id");
            }
            const userInfo: Pick<User, "id" | "name" | "email" | "phone" | "created_at"> = await userService.getUserById(req.userId);

            res.status(200).json({ userInfo: userInfo });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body as { email: string };

            if (!email) {
                throw new Error("Email is required");
            }

            const code: string = generateCode();

            await passwordResetService.createResetCode(email, code);
            await emailService.sendResetCode(email, code);

            res.status(200).json({ message: "Reset code sent to email" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async resetPasswordCode(req: Request, res: Response): Promise<void> {
        try {
            const { email, code } = req.body as { email: string; code: string };

            if (!email || !code) {
                throw new Error("Email and code are required");
            }

            await passwordResetService.verifyCode(email, code);

            res.status(200).json({ message: "Code is valid" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async resetPasswordNew(req: Request, res: Response): Promise<void> {
        try {
            const { email, code, password } = req.body as { email: string; code: string; password: string };

            if (!email || !code || !password) {
                throw new Error("Email, code and new password are required");
            }

            await passwordResetService.verifyCode(email, code);
            await passwordResetService.updatePassword(email, password);

            res.status(200).json({ message: "Password changed successfully" });
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }
}

export default new userController();