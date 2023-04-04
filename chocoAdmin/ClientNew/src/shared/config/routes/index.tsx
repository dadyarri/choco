import {BarChartOutlined, CloudDownloadOutlined, CloudUploadOutlined} from "@ant-design/icons";
import React from "react";
import {Route} from "../../../entities/route";
import {HomePage} from "../../../pages/home";
import {OrdersPage} from "../../../pages/orders";
import {ShipmentsPage} from "../../../pages/shipments";

const routes: Route[] = [
  {
    index: true,
    path: "/",
    key: "home",
    element: <HomePage/>,
    icon: <BarChartOutlined />,
    label: "Главная"
  },
  {
    path: "/orders",
    key: "orders",
    element: <OrdersPage/>,
    icon: <CloudDownloadOutlined />,
    label: "Заказы"
  },
  {
    path: "/shipments",
    key: "shipments",
    element: <ShipmentsPage/>,
    icon: <CloudUploadOutlined />,
    label: "Поставки"
  }
];

export default routes;