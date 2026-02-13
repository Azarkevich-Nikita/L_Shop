import express from "express";
// @ts-ignore
import router from "./router/router.ts";

const PORT: number = 8080;
const app = express();

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
