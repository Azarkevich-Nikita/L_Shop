import fs from "node:fs/promises";

class JsonStorageService{
    async writeJSON<T>(file: string, data: T): Promise<void> {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    }

    async readJSON<T>(file: string): Promise<T> {
        try {
            const raw = await fs.readFile(file, "utf-8");
            return JSON.parse(raw) as T;
        }
        catch(err){
            console.error(err);
            throw err;
        }
    }
}

export default new JsonStorageService();