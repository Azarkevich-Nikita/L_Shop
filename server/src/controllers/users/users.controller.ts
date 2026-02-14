import type { Request, Response } from "express";
// @ts-ignore
import userService from "../../services/users/users.service.ts";

class userController{
    async getAll(req : Request, res : Response){
        res.status(200).json(await userService.getAllUsers.toString())
    }
}

export default new userController();