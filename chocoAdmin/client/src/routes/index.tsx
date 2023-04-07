import Route from "./index.specs";
import React from "react";
import Warehouse from "pages/warehouse";
import Home from "pages/home";
import ProductEdit from "pages/product-edit";
import Orders from "pages/orders";
import {OrderEdit} from "pages/order-edit";
import Shipments from "pages/shipments";
import {ShipmentEdit} from "pages/shipment-edit";
import ProductCategories from "pages/categories";
import {Inventory} from "pages/inventory";
import ProductCategoryEdit from "pages/category-edit";

const routes: Route[] = [
    {
        index: true,
        path: "/app",
        element: <Home/>,
        label: "Главная"
    },
    {
        path: "/app/orders",
        element: <Orders/>,
        label: "Заказы"
    },
    {
        path: "/app/shipments",
        element: <Shipments/>,
        label: "Поставки"
    },
    {
        path: "/app/warehouse",
        element: <Warehouse/>,
        label: "Склад"
    },
    {
        path: "/app/inventory",
        element: <Inventory/>,
        label: "Ревизия"
    },
    {
        path: "/app/categories",
        element: <ProductCategories/>,
        label: "Категории"
    },
    {
        path: "/app/warehouse/add",
        element: <ProductEdit/>
    },
    {
        path: "/app/warehouse/edit/:productId",
        element: <ProductEdit/>
    },
    {
        path: "/app/orders/add",
        element: <OrderEdit/>
    },
    {
        path: "/app/orders/edit/:orderId",
        element: <OrderEdit/>
    },
    {
        path: "/app/shipments/add",
        element: <ShipmentEdit/>
    },
    {
        path: "/app/shipments/edit/:shipmentId",
        element: <ShipmentEdit/>
    },
    {
        path: "/app/categories/add",
        element: <ProductCategoryEdit/>
    },
    {
        path: "/app/categories/edit/:categoryId",
        element: <ProductCategoryEdit/>
    },
];

export default routes;