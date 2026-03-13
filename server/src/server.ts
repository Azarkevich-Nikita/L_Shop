import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// @ts-ignore
import router from "./router/router.ts";

// Эмуляция __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env из той же папки, где лежит server.ts (src/.env)
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT: number = 8080;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

async function startApp() {
    try {
        app.listen(PORT, () =>
            console.log("Server started on PORT: " + PORT)
        );
    } catch (ex) {
        console.log(ex);
    }
}

startApp();
