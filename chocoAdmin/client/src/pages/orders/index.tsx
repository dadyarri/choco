import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Chip, CircularProgress, Container, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import { OrderItem, orderLib } from "entities";
import { auth } from "features";

const OrdersPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken()) {
            navigate("/app/login");
        }
    }, [navigate]);

    const orders = useQuery("orders", orderLib.getOrders);
    const isOnDesktop = useMediaQuery("(min-width: 600px)");

    const colDef: GridColDef[] = [
        {
            field: "date",
            headerName: "Дата заказа",
            width: 120,
            type: "date",
            valueFormatter: (params) => DateTime.fromISO(params.value).toLocaleString(),
        },
        {
            field: "status",
            headerName: "Статус заказа",
            width: 200,
            renderCell: (params) => {
                const label = params.row.status.name;
                let icon: React.ReactElement | undefined;
                let color:
                    | "default"
                    | "warning"
                    | "info"
                    | "success"
                    | "primary"
                    | "secondary"
                    | "error"
                    | undefined;
                switch (label) {
                    case "Обрабатывается": {
                        color = "warning";
                        icon = <WatchLaterIcon />;
                        break;
                    }
                    case "Доставляется": {
                        color = "info";
                        icon = <LocalShippingIcon />;
                        break;
                    }
                    case "Выполнен": {
                        color = "success";
                        icon = <CheckIcon />;
                        break;
                    }
                    case "Отменён": {
                        color = "error";
                        icon = <HighlightOffIcon />;
                        break;
                    }
                    default: {
                        color = "default";
                        icon = undefined;
                    }
                }
                return <Chip label={label} color={color} variant={"outlined"} icon={icon} />;
            },
        },
        {
            field: "orderItems",
            headerName: "Содержимое заказа",
            width: 300,
            renderCell: (params) => {
                return (
                    <ul>
                        {params.row.orderItems.map((item: OrderItem) => (
                            <li key={item.id}>
                                {item.product.name} ({item.amount}{" "}
                                {item.product.isByWeight ? "кг." : "шт."})
                            </li>
                        ))}
                    </ul>
                );
            },
        },
        {
            field: "address",
            headerName: "Адрес",
            width: 400,
            valueGetter: (params) =>
                `г. ${params.row.address.city.name}, ${params.row.address.street}, ${params.row.address.building}`,
        },
        {
            field: "total",
            headerName: "Итог",
            width: 80,
            valueGetter: (params) =>
                `${params.row.orderItems.reduce(
                    (sum: number, item: OrderItem) => sum + item.product.retailPrice * item.amount,
                    0,
                )} ₽`,
        },
    ];

    return (
        <>
            <Typography variant={"h4"}>Заказы</Typography>
            {orders.isLoading && <CircularProgress />}
            <Container maxWidth={"xl"}>
                {orders.data !== undefined && (
                    <DataGrid
                        rows={orders.data}
                        columns={colDef}
                        autoHeight
                        pageSizeOptions={[5, 10, 15, 50, 100]}
                        getRowHeight={() => "auto"}
                        getEstimatedRowHeight={() => 200}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 5 } },
                        }}
                        columnVisibilityModel={{
                            status: isOnDesktop,
                            address: isOnDesktop,
                        }}
                    />
                )}
            </Container>
        </>
    );
};

export default OrdersPage;
