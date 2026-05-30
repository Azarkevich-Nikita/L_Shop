import express from "express";
import "dotenv/config";
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

// CORS configuration for credentials
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.sendStatus(200);
    } else {
        next();
    }
});

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
