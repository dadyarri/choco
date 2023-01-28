import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse/warehouse";
import Home from "../pages/home";
import ProductEdit from "../pages/product-edit/product-edit";

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