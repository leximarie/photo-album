import { Router } from "express";
import { get } from "../db";

const router = Router();
const db = get();

router.get("/", async (req, res) => {
    const albums = await db.getData('/albums');
    return res.send(albums);
});

router.get("/:id", async (req, res) => {
    const index = await db.getIndex(`/albums`, req.params.id);
    const album = await db.getData(`/albums[${index}]`);
    return res.send(album);
});

router.post("/", async (req, res) => {
    console.log(req.body);
    const last = await db.getData('/albums[-1]');
    const album = {
        id: last.id + 1,
        title: req.body.title,
        photoCount: 0,
        photos: [],
        coverUrl: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    };
    await db.push('/albums/[]', album, true);
    return res.send(album);
});

router.post("/:id/photos", async (req, res) => {
    const index = await db.getIndex(`/albums`, req.params.id);
    const lastPhoto = await db.getData('/photos[-1]');
    const photo = {
        id: lastPhoto.id + 1,
        title: req.body.title,
        url: req.body.url,
        thumbnailUrl: req.body.thumbnailUrl || req.body.url,
        albumId: req.params.id
    }

    await db.push(`/albums[${index}]/photos[]`, photo, true);
    return photo;
});

export default router;