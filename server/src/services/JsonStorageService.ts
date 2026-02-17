import fs from "node:fs/promises";

class JsonStorageService{
    async writeJSON<T>(file: string, data: T): Promise<void> {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    }

    async readJSON(file: string){
        return JSON.parse(await fs.readFile(file, 'utf-8'));
    }
}

export default new JsonStorageService();