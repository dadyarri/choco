import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoIcon from "@mui/icons-material/Info";
import ListIcon from "@mui/icons-material/List";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import RoomIcon from "@mui/icons-material/Room";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
    Button,
    Chip,
    CircularProgress,
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { OrderItem, orderLib } from "entities";
import { auth } from "features";

const OrderViewPage = () => {
    const { orderId } = useParams();
    const [open, setOpen] = useState(true);

    const order = useQuery(["order", orderId], () => orderLib.getOrderById(orderId!));

    const getStatusChip = (label: string) => {
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
                icon = <ScheduleIcon />;
                break;
            }
            case "Доставляется": {
                color = "info";
                icon = <LocalShippingIcon />;
                break;
            }
            case "Выполнен": {
                color = "success";
                icon = <CheckCircleOutlineIcon />;
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
    };

    return (
        <>
            <Typography variant={"h4"} sx={{ marginBottom: 2 }}>
                Просмотр заказа
            </Typography>
            {auth.hasToken() && (
                <Stack spacing={2} direction={"row"} sx={{ marginBottom: 2 }}>
                    <Button
                        color={"primary"}
                        variant={"outlined"}
                        component={Link}
                        startIcon={<EditIcon />}
                        to={`/app/orders/edit/${orderId}`}
                    >
                        Редактировать
                    </Button>
                    <Button
                        color={"secondary"}
                        variant={"outlined"}
                        component={Link}
                        startIcon={<ChevronLeftIcon />}
                        to={"/app/orders"}
                    >
                        Назад
                    </Button>
                </Stack>
            )}

            {order.isLoading && <CircularProgress />}
            {order.data && (
                <Paper sx={{ maxWidth: 400 }}>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CalendarTodayIcon />
                            </ListItemIcon>
                            <ListItemText>Дата</ListItemText>
                            <ListItemText>
                                {DateTime.fromISO(
                                    order.data.date.toLocaleString(),
                                ).toLocaleString()}
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText>Статус </ListItemText>
                            <ListItemIcon>{getStatusChip(order.data.status.name)}</ListItemIcon>
                        </ListItem>
                        <ListItemButton onClick={() => setOpen(!open)}>
                            <ListItemIcon>
                                <ListIcon />
                            </ListItemIcon>
                            <ListItemText>Содержимое</ListItemText>
                        </ListItemButton>
                        <Collapse in={open}>
                            <List sx={{ pl: 4 }}>
                                {order.data.orderItems.map((item: OrderItem) => (
                                    <ListItem key={item.id}>
                                        <ListItemText
                                            primary={item.product.name}
                                            secondary={`${item.product.retailPrice} * ${
                                                item.amount
                                            } ${item.product.isByWeight ? "кг." : "шт."} = ${
                                                item.product.retailPrice * item.amount
                                            } ₽`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Collapse>
                        <ListItem>
                            <ListItemIcon>
                                <RoomIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Адрес"}
                                secondary={`г. ${order.data.address.city.name}, ${order.data.address.street}, ${order.data.address.building}`}
                            ></ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <PaymentsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={"Итог"}
                                secondary={`${order.data.orderItems.reduce(
                                    (sum: number, item: OrderItem) =>
                                        sum + item.product.retailPrice * item.amount,
                                    0,
                                )} ₽`}
                            />
                        </ListItem>
                    </List>
                </Paper>
            )}
        </>
    );
};

export default OrderViewPage;
