import { JsonDB, Config } from "node-json-db";

let db;

export function get() {
    if (db) {
        return db;
    }

    db = new JsonDB(new Config("photoApp", true, false, '/'));
    return db;
}

export async function seed() {
    get();

    const res = await fetch("https://jsonplaceholder.typicode.com/photos");
    const photos = await res.json();
    const albumMap = new Map();
    for (const photo of photos) {
        const album = albumMap.get(photo.albumId) || {
            coverUrl: photo.thumbnailUrl,
            title: `Album #${photo.albumId}`,
            id: photo.albumId,
            photos: [],
            photoCount: 0
        };
        album.photoCount++;
        album.photos.push(photo);
        albumMap.set(photo.albumId, album);
    }

    db.push("/photos", photos);
    db.push("/albums", Array.from(albumMap.values()));
}

export default get;
