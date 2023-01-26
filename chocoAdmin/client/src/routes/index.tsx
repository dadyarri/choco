import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse/warehouse";
import Home from "../pages/home";

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