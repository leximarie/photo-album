import React, { useEffect, useState } from "react";
import { API_ROOT } from "../constants";
import { useParams } from "react-router";
import { Album } from "../models/album.model";
import { Photo } from "../models/photo.model";
import { Modal, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

export default () => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [album, setAlbum] = useState<Album>();
    const [modalOpen, setModalOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
        const albumId = Number(params.id) || 0;

        fetch(`${API_ROOT}/albums/${albumId}`)
            .then((res) => res.json())
            .then((album: Album) => setAlbum(album))
            .then(() => setLoading(false))
            .catch((err) => {
                setError(true);
                setLoading(false);
            })
    }, [params.id]);

    return (
        <div className="py-4">
            <Link to="/albums" className="btn btn-primary mb-2">View All Albums</Link>
            <h1>{album?.title}</h1>
            {loading && <div className="page-loading d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            {error && (
                <div className="alert alert-danger" role="alert">An error occured retrieving album</div>
            )}
            {!loading && album?.photos?.length && <div className="row g-3" role="grid">
                {album?.photos?.map((photo, index) => (
                    <div className="col" key={`photoThumbnailCol${photo.id}`} role="gridcell">
                        <button
                            className="img-hover btn"
                            onClick={() => {
                                setPhotoIndex(index);
                                setModalOpen(true);
                            }}
                        >
                            <img src={photo.thumbnailUrl} className="rounded" alt={photo.title} id={`photoThumbnail${photo.id}`} />
                            <div className="img-description p-2 rounded-bottom">
                                <h6 className="card-subtitle" aria-labelledby={`photoThumbnail${photo.id}`}>
                                    {photo.id}: {photo.title}
                                </h6>
                            </div>
                        </button>
                    </div>
                ))}
            </div>}
            <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered size="xl" data-bs-theme="dark">
                <Modal.Header closeButton className="text-overflow-ellipsis" onHide={() => setModalOpen(false)}>
                    {album?.photos && album.photos[photoIndex] && (
                        <Modal.Title>{album.photos[photoIndex].id}: {album.photos[photoIndex].title}</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body className="p-0">
                    <Carousel activeIndex={photoIndex} onSelect={setPhotoIndex} interval={null}>
                        {album?.photos?.map((photo) => (
                            <Carousel.Item key={`carouselSlide${photo.id}`}>
                                <img src={photo.url} alt={photo.title} className="mx-auto d-block" />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </div>
    )
}