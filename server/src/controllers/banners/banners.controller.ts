import type { Request, Response } from "express";
// @ts-ignore
import bannersService from "../../services/banners/banners.service.ts";

class BannersController {
    async getBanners(req: Request, res: Response) {
        try {
            const banners = await bannersService.getBanners();
            res.status(200).json(banners);
        } catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }
}

export default new BannersController();
