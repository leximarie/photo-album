import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Albums from "../components/Albums";
import { mockFetch, renderWithRouter } from "./utils";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { Route, Routes } from "react-router";
import Album from "../components/Album";

const MOCK_ALBUM = {
    id: 1,
    title: "Album #1",
    coverUrl: "https://via.placeholder.com/150/92c952",
    photoCount: 4,
    photos: [
        {
            "albumId": 1,
            "id": 1,
            "title": "accusamus beatae ad facilis cum similique qui sunt",
            "url": "https://via.placeholder.com/600/92c952",
            "thumbnailUrl": "https://via.placeholder.com/150/92c952"
        },
        {
            "albumId": 1,
            "id": 2,
            "title": "reprehenderit est deserunt velit ipsam",
            "url": "https://via.placeholder.com/600/771796",
            "thumbnailUrl": "https://via.placeholder.com/150/771796"
        },
        {
            "albumId": 1,
            "id": 3,
            "title": "officia porro iure quia iusto qui ipsa ut modi",
            "url": "https://via.placeholder.com/600/24f355",
            "thumbnailUrl": "https://via.placeholder.com/150/24f355"
        },
        {
            "albumId": 1,
            "id": 4,
            "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
            "url": "https://via.placeholder.com/600/d32776",
            "thumbnailUrl": "https://via.placeholder.com/150/d32776"
        }
    ]
};

const MOCK_ALBUM_2 = {
    id: 2,
    title: "Album #2",
    coverUrl: "https://via.placeholder.com/150/d32776",
    photoCount: 1,
    photos: [
        {
            "albumId": 2,
            "id": 5,
            "title": "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
            "url": "https://via.placeholder.com/600/d32776",
            "thumbnailUrl": "https://via.placeholder.com/150/d32776"
        }
    ]
}

const MOCK_ALBUMS = [MOCK_ALBUM, MOCK_ALBUM_2];

describe('Albums', function () {
    describe('fetched albums', () => {
        beforeEach(() => {
            mockFetch(MOCK_ALBUMS);
        })

        it('should display albums', async () => {
            renderWithRouter(<Albums />, { route: "/albums" });

            await waitFor(async () => {
                const albums = await screen.findAllByRole("gridcell");
                expect(albums.length).toBe(2);
                for (let i = 0; i < albums.length; i++) {
                    const img = albums[i].querySelector("img");
                    const title = albums[i].querySelector("h5");
                    const desc = albums[i].querySelector("h6");
                    const viewButton = albums[i].querySelector("a");
                    expect(img?.src).toBe(MOCK_ALBUMS[i].coverUrl);
                    expect(img?.alt).toBe(MOCK_ALBUMS[i].title);
                    expect(title).toHaveTextContent(MOCK_ALBUMS[i].title);
                    expect(desc).toHaveTextContent(MOCK_ALBUMS[i].photoCount + " photos");
                    expect(viewButton?.href).toContain("/albums/" + MOCK_ALBUMS[i].id);
                }
            })
        });

        it('should navigate to album page on View click', async () => {
            const { user } = renderWithRouter((
                <Routes>
                    <Route path="/albums" element={<Albums />} />
                    <Route path="/albums/:id" element={<Album />} />
                </Routes>
            ), { route: "/albums" });

            const albums = await screen.findAllByRole("gridcell");
            const link = albums[0].querySelector("a");

            await user.click(link);

            expect(window.location.href).toContain("/albums/1");
        })
    });
    
    it('should display loading indicator while fetching', async () => {
        global.fetch = jest.fn(() =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        json: () => Promise.resolve([])
                    } as Response);
                }, 100);
            })
        );

        renderWithRouter(<Albums />, { route: "/albums" });

        const spinner = await screen.findByRole("status");

        expect(spinner).toBeInTheDocument();
    })

    it('should display an error if we recieve one on fetch', async () => {
        global.fetch = jest.fn(() =>
            new Promise((resolve, reject) => {
                reject({
                    json: () => reject("Bad")
                } as Response);
            })
        );

        renderWithRouter(<Albums />, { route: "/albums" });

        const errorAlert = await screen.findByRole("alert");

        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveTextContent("An error occured retrieving album");
    })
});
