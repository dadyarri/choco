import Route from "./index.specs";
import React from "react";
import Warehouse from "../pages/warehouse";
import Home from "../pages/home";
import ProductEdit from "../pages/product-edit";
import Orders from "../pages/orders";
import {OrderEdit} from "../pages/order-edit";
import Shipments from "../pages/shipments";
import {ShipmentEdit} from "../pages/shipment-edit";

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
        "path": "/shipments/add",
        element: <ShipmentEdit/>
    },
    {
        "path": "/shipments/edit/:shipmentId",
        element: <ShipmentEdit/>
    }
];

export default routes;