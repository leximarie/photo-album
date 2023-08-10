import { Photo } from "./photo.model";

export type Album = {
    title?: string,
    description?: string,
    coverUrl: string,
    id: number,
    photoCount: number,
    photos: Photo[]
};
