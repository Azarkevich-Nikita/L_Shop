import type { Request, Response } from "express";
// @ts-ignore
import userService from "../../services/users/users.service.ts";
//@ts-ignore
import sessionService from "../../services/sessions.service.ts";
//@ts-ignore
import sessionsService from "../../services/sessions.service.ts";
//@ts-ignore
import UsersService from "../../services/users/users.service.ts";
//@ts-ignore
import type {User} from "../models/users.model.ts";
//@ts-ignore
import type {Session} from "../../types/session.types.ts";

class userController{
    async getAll(req : Request, res : Response){
        res.status(200).json(await userService.getAllUsers())
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const newUser: User = await userService.register(req.body);

            const session:Session = await sessionService.createSession(newUser.id);

            res.cookie("currSid", session.sessionId, {
                httpOnly: true,
                maxAge: 600_000
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async login(req: Request, res : Response): Promise<void> {
        try{
            const user: User = await UsersService.login(req.body);

            const session: Session = await sessionsService.createSession(user.id);

            res.cookie("currSid", session.sessionId, {
                httpOnly: true,
                maxAge: 600_000
            });

            res.status(201).json({ message: "User login successfully" });
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "Unknown error occurred"});
            }
        }
    }

    async me(req: Request, res : Response) {
        try {
            const session: Session = await sessionService.getSessionInfoBySessionId(req.cookies.currSid);

            const userInfo: Pick<User, 'id' | 'name' | 'email' | 'phone' | 'created_at'> = await userService.getUserById(session.userId);

            console.log(userInfo)

            res.status(200).json({userInfo: userInfo});
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "Unknown error occurred"});
            }
        }
    }
}

export default new userController();