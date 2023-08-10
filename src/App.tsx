import React from "react";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Albums from "./components/Albums";
import Album from "./components/Album";
import Layout from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/albums" replace />
            },
            {
                path: "/albums",
                element: <Albums />
            },
            {
                path: "/albums/:id",
                element: <Album />
            }
        ]
    }
]);

const App = () => <RouterProvider router={router} />;

export default App;