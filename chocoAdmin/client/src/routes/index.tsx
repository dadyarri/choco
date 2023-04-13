import React from "react";

// import ProductCategories from "pages/categories";
// import ProductCategoryEdit from "pages/category-edit";
import Home from "pages/home";
// import { Inventory } from "pages/inventory";
import Login from "pages/login";
import OrderEdit from "pages/orders/edit";
import Orders from "pages/orders/show";
// import ProductEdit from "pages/product-edit";
// import { ShipmentEdit } from "pages/shipment-edit";
import Profile from "pages/profile";
import Shipments from "pages/shipments/show";
import Warehouse from "pages/warehouse";

import Route from "./index.specs";

const routes: Route[] = [
    {
        index: true,
        path: "/app",
        element: <Home />,
        label: "Главная",
    },
    {
        path: "/app/orders",
        element: <Orders />,
        label: "Заказы",
    },
    {
        path: "/app/shipments",
        element: <Shipments />,
        label: "Поставки",
    },
    {
        path: "/app/warehouse",
        element: <Warehouse />,
        label: "Склад",
    },
    {
        path: "/app/profile",
        element: <Profile />,
        label: "Профиль",
    },
    {
        path: "/app/login",
        element: <Login />,
    },
    // {
    //     path: "/app/inventory",
    //     element: <Inventory />,
    //     label: "Ревизия",
    // },
    // {
    //     path: "/app/categories",
    //     element: <ProductCategories />,
    //     label: "Категории",
    // },
    // {
    //     path: "/app/warehouse/add",
    //     element: <ProductEdit />,
    // },
    // {
    //     path: "/app/warehouse/edit/:productId",
    //     element: <ProductEdit />,
    // },
    // {
    //     path: "/app/orders/add",
    //     element: <OrderEdit />,
    // },
    {
        path: "/app/orders/edit/:orderId",
        element: <OrderEdit />,
    },
    // {
    //     path: "/app/shipments/add",
    //     element: <ShipmentEdit />,
    // },
    // {
    //     path: "/app/shipments/edit/:shipmentId",
    //     element: <ShipmentEdit />,
    // },
    // {
    //     path: "/app/categories/add",
    //     element: <ProductCategoryEdit />,
    // },
    // {
    //     path: "/app/categories/edit/:categoryId",
    //     element: <ProductCategoryEdit />,
    // },
];

export default routes;
