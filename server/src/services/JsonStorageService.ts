import fs from "node:fs/promises";

class JsonStorageService{
    async writeJSON<T>(file: string, data: T): Promise<void> {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    }

    async readJSON(file: string){
        try {
            return JSON.parse(await fs.readFile(file, 'utf-8'));
        }
        catch(err){
            console.error(err);
        }
    }
}

export default new JsonStorageService();