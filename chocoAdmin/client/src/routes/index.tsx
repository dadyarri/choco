import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse/warehouse";
import Home from "../pages/home";
import WarehouseEdit from "../pages/warehouse-edit/warehouse-edit";

const routes: Route[] = [
    {
        index: true,
        element: <Home/>
    },
    {
        path: "/warehouse",
        element: <Warehouse/>
    },
    {
        path: "/warehouse/add",
        element: <WarehouseEdit/>
    },
    {
        path: "/warehouse/edit/:productId",
        element: <WarehouseEdit/>
    }
];

export default routes;