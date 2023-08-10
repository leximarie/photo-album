import * as React from "react";
import { screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Album from "../components/Album";
import { mockFetch, renderWithRouter } from "./utils";

const MOCK_ALBUM = {
    id: 1,
    title: "Album #1",
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

describe('Album', function () {
    describe('fetched album', () => {
        beforeEach(() => {
            mockFetch(MOCK_ALBUM)
        })

        it('should display album title', async () => {
            renderWithRouter(<Album />, { route: "/albums/1" });

            await waitFor(() => {
                expect(screen.getByText('Album #1')).toBeInTheDocument();
            })
        });

        it('should display photos', async () => {
            renderWithRouter(<Album />, { route: "/albums/1" });

            await waitFor(async () => {
                const photos = await screen.findAllByRole("gridcell");
                expect(photos.length).toBe(4);
                for (let i = 0; i < photos.length; i++) {
                    const img = photos[i].querySelector("img");
                    expect(img?.src).toBe(MOCK_ALBUM.photos[i].thumbnailUrl);
                    expect(img?.alt).toBe(MOCK_ALBUM.photos[i].title);
                }
            })
        });

        it('should display id and title on hover', async () => {
            const { user, container } = renderWithRouter(<Album />, { route: "/albums/1" });

            const photos = await screen.findAllByRole("gridcell");
            const col = photos[0];
            const button = col.querySelector("button");
            const img = button?.querySelector("img");
            const desc = container.querySelector(`[aria-labelledby=${img?.id}]`);

            await waitFor(async () => {
                await user.hover(button);

                expect(desc?.textContent).toBe(`${MOCK_ALBUM.photos[0].id}: ${MOCK_ALBUM.photos[0].title}`);
            });
        })

        it('should open modal on click', async () => {
            const { user, container } = renderWithRouter(<Album />, { route: "/albums/1" });
            const photo = MOCK_ALBUM.photos[0];
            const photos = await screen.findAllByRole("gridcell");
            const col = photos[0];
            const button = col.querySelector("button");

            // open the modal on image click
            await user.click(button);

            const modal = await screen.findByRole("dialog");
            const modalHeader = modal.querySelector(".modal-title");
            const slides = modal.querySelectorAll(".carousel-item");
            const currentSlide = slides[0];
            const currentImg = currentSlide.firstElementChild as HTMLImageElement;

            expect(modal.classList.contains("show")).toBeTruthy();
            expect(modalHeader).toHaveTextContent(`${photo.id}: ${photo.title}`);
            expect(slides.length).toBe(4);
            expect(currentSlide.classList.contains("active")).toBeTruthy();
            expect(currentImg.src).toBe(photo.url);
        })

        it('should show next photo when carousel next is clicked', async () => {
            const { user, container } = renderWithRouter(<Album />, { route: "/albums/1" });

            const photo = MOCK_ALBUM.photos[0];
            const photos = await screen.findAllByRole("gridcell");
            const col = photos[0];
            const button = col.querySelector("button");

            // open modal by clicking image
            await user.click(button);

            const modal = await screen.findByRole("dialog");
            const slides = modal.querySelectorAll(".carousel-item");

            expect(slides[0].classList.contains("active")).toBeTruthy();

            // click carousel "next button"
            const carouselButtons = modal.querySelectorAll(`[role="button"]`);
            await user.click(carouselButtons[1])

            expect(slides[1].classList.contains("active")).toBeTruthy();
            expect((slides[1].firstElementChild as HTMLImageElement).src).toBe(MOCK_ALBUM.photos[1].url);
        })

        it('should show correct img if modal is closed then clicked again', async () => {
            const { user, container } = renderWithRouter(<Album />, { route: "/albums/1" });

            const photo = MOCK_ALBUM.photos[0];
            const photos = await screen.findAllByRole("gridcell");
            const photo1 = photos[0].querySelector("button");

            // open modal by clicking image
            await user.click(photo1);

            let modal = await screen.findByRole("dialog");
            let slides = modal.querySelectorAll(".carousel-item");

            expect(slides[0].classList.contains("active")).toBeTruthy();

            // close the modal
            const closeBtn = modal.querySelector(`[aria-label="Close"]`);
            await user.click(closeBtn);

            expect(modal.classList.contains("show")).toBeFalsy();

            // click on a new photo
            const photo3 = photos[2].querySelector("button");
            expect((photo3?.firstElementChild as HTMLImageElement).src).toBe(MOCK_ALBUM.photos[2].thumbnailUrl);
            await user.click(photo3);

            modal = await screen.findByRole("dialog");
            slides = modal.querySelectorAll(".carousel-item");

            expect(modal.classList.contains("show")).toBeTruthy();

            expect(slides[2].classList.contains("active")).toBeTruthy();
            expect((slides[2].firstElementChild as HTMLImageElement).src).toBe(MOCK_ALBUM.photos[2].url);
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

        renderWithRouter(<Album />, { route: "/albums/1" });

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

        renderWithRouter(<Album />, { route: "/albums/1" });

        const errorAlert = await screen.findByRole("alert");

        expect(errorAlert).toBeInTheDocument();
        expect(errorAlert).toHaveTextContent("An error occured retrieving album");
    })
});
