import React from "react";
import { Outlet } from "react-router";

export default () => (
    <div className="container">
        <Outlet />
    </div>
);