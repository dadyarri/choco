import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse/warehouse-page";
import Home from "../pages/home-page";

const routes: Route[] = [
    {
        index: true,
        element: <Home/>
    },
    {
        path: "/warehouse",
        element: <Warehouse/>
    }
];

export default routes;