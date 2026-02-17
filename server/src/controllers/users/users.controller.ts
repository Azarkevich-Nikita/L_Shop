import type { Request, Response } from "express";
// @ts-ignore
import userService from "../../services/users/users.service.ts";

class userController{
    async getAll(req : Request, res : Response){
        res.status(200).json(await userService.getAllUsers())
    }
    async register(req: Request, res: Response): Promise<void> {
        console.log('Start');
        try {
            const result = await userService.register(req.body);
            res.status(201).json(result);
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }
}

export default new userController();