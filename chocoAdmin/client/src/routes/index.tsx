import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse";
import Home from "../pages";
import ProductEdit from "../pages/product-edit";

const routes: Route[] = [
    {
        index: true,
        path: "/",
        element: <Home/>,
        label: "Главная"
    },
    {
        path: "/warehouse",
        element: <Warehouse/>,
        label: "Склад"
    },
    {
        path: "/warehouse/add",
        element: <ProductEdit/>
    },
    {
        path: "/warehouse/edit/:productId",
        element: <ProductEdit/>
    }
];

export default routes;