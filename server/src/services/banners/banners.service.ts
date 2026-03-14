import path from "path";
import { fileURLToPath } from "url";
// @ts-ignore
import jsonStorageService from "../JsonStorageService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../../database/banners.json");

export interface Banner {
    id: number;
    image_url: string;
    link?: string;
    title?: string;
}

class BannersService {
    async getBanners(): Promise<Banner[]> {
        const data = await jsonStorageService.readJSON<Banner[]>(filePath);
        return Array.isArray(data) ? data : [];
    }
}

export default new BannersService();
