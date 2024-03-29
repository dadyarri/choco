import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse";
import Home from "../pages/home";
import ProductEdit from "../pages/product-edit";
import Orders from "../pages/orders";
import {OrderEdit} from "../pages/order-edit";
import Shipments from "../pages/shipments";
import {ShipmentEdit} from "../pages/shipment-edit";
import ProductCategories from "../pages/categories";
import {Inventory} from "../pages/inventory";
import ProductCategoryEdit from "../pages/category-edit";

const routes: Route[] = [
    {
        index: true,
        path: "/",
        element: <Home/>,
        label: "Главная"
    },
    {
        path: "/orders",
        element: <Orders/>,
        label: "Заказы"
    },
    {
        path: "/shipments",
        element: <Shipments/>,
        label: "Поставки"
    },
    {
        path: "/warehouse",
        element: <Warehouse/>,
        label: "Склад"
    },
    {
        path: "/inventory",
        element: <Inventory/>,
        label: "Ревизия"
    },
    {
        path: "/categories",
        element: <ProductCategories/>,
        label: "Категории"
    },
    {
        path: "/warehouse/add",
        element: <ProductEdit/>
    },
    {
        path: "/warehouse/edit/:productId",
        element: <ProductEdit/>
    },
    {
        path: "/orders/add",
        element: <OrderEdit/>
    },
    {
        path: "/orders/edit/:orderId",
        element: <OrderEdit/>
    },
    {
        path: "/shipments/add",
        element: <ShipmentEdit/>
    },
    {
        path: "/shipments/edit/:shipmentId",
        element: <ShipmentEdit/>
    },
    {
        path: "/categories/add",
        element: <ProductCategoryEdit/>
    },
    {
        path: "/categories/edit/:categoryId",
        element: <ProductCategoryEdit/>
    },
];

export default routes;