import express from "express";
import path from "path";
import bodyParser from "body-parser";

import photoController from "./controllers/photo-controller";
import albumController from "./controllers/album-controller";
import { seed } from "./db";

const root = process.cwd();

function createServer() {
    const app = express();
    const PORT = process.env.PORT || 3100;

    app.use(bodyParser.json());
    
    app.use(express.static(path.join(root, "build")));
    
    app.use("/api/photos", photoController);
    app.use("/api/albums", albumController);
    
    app.get("*", async (req, res) => {
        res.sendFile(path.join(root, "build", "index.html"));
    });
    app.listen(PORT, () => console.log("Server is running on " + PORT));
}

seed().then(() => {
    createServer();
});
