import React, { useEffect, useRef, useState } from "react";
import { Photo } from "../models/photo.model";
import { Album } from "../models/album.model";
import { API_ROOT } from "../constants";
import { Link } from "react-router-dom";
import { Overlay, Popover } from "react-bootstrap";

const NewAlbumPopover = (props: { onSubmit: (form: { [key:string]: any }) => void }) => {
    const ref = useRef(null);
    const [target, setTarget] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");

    const handleClick = (event) => {
        setShowForm(!showForm);
        setTarget(event.target);
    };

    const handleSubmit = () => {
        props.onSubmit({ title: title })
    }

    return (
        <div className="col" ref={ref}>
            <button className="btn btn-primary float-end" onClick={handleClick}>
                New Album
            </button>
            <Overlay
                show={showForm}
                target={target}
                placement="bottom"
                container={ref}
                containerPadding={20}
            >
                <Popover id="popover-contained">
                <Popover.Header as="h3">New Album</Popover.Header>
                <Popover.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="titleInput" className="form-label">
                                Album Title
                            </label>
                            <input
                                type="string"
                                className="form-control"
                                id="titleInput"
                                onChange={(evt) => setTitle(evt.target.value)}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </form>
                </Popover.Body>
                </Popover>
            </Overlay>
        </div>
    );
}

export default () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);

    useEffect(() => {
        fetch(`${API_ROOT}/albums`)
            .then((res) => res.json())
            .then((albums: Album[]) => setAlbums(albums))
            .then(() => setLoading(false))
            .catch((err) => {
                setError(true);
                setLoading(false);
            })
    }, []);

    function onSubmit(form: any) {
        fetch(`${API_ROOT}/albums`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
            .then((res) => res.json())
            .then((album) => setAlbums([album, ...albums]))
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="pt-3">
            <div className="row">
                <div className="col">
                    <h1>Albums</h1>
                </div>
                {/* <NewAlbumPopover onSubmit={onSubmit} /> */}
            </div>
            {loading && <div className="page-loading d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>}
            {error && (
                <div className="alert alert-danger" role="alert">An error occured retrieving albums</div>
            )}
            {!loading && albums.length && <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xlg-5 g-4" role="grid">
                {albums.map((album) => (
                    <div className="col" role="gridcell" key={`albumCol${album.id}`}>
                        <div className="card">
                            <img src={album.coverUrl} className="card-img-top" alt={album.title} />
                            <div className="card-body">
                                <h5 className="card-title">
                                    {album.title}
                                </h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">
                                    {album.photoCount} photos
                                </h6>
                                <Link to={`/albums/${album.id}`} className="btn btn-primary">View</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    )
}