import fs from "node:fs/promises";

class JsonStorageService{
    /**
     * Writes JSON data to a file with two-space formatting.
     *
     * @template T - Serializable data shape.
     * @param file - Absolute path to the JSON file.
     * @param data - Data to persist.
     */
    async writeJSON<T>(file: string, data: T): Promise<void> {
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    }

    /**
     * Reads and parses a JSON file.
     *
     * @template T - Expected parsed data shape.
     * @param file - Absolute path to the JSON file.
     * @returns Parsed JSON data.
     * @throws Error when the file cannot be read or parsed.
     */
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
