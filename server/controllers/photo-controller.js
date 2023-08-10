import { Router } from "express";
import { get } from "../db";

const router = Router();
const db = get();

router.get("/", async (req, res) => {
    const photos = await db.getData('/photos');
    return res.send(photos);
});

router.get("/:id", async (req, res) => {
    const index = await db.getIndex(`/photos`, req.params.id);
    const photo = await db.getData(`/photos[${index}]`);
    return res.send(photo);
});

export default router;