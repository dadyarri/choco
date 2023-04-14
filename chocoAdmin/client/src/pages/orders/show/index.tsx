import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import RouteIcon from "@mui/icons-material/Route";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Container,
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { DateTime } from "luxon";
import React, { FC, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";

import { Order, OrderItem, orderLib } from "entities";
import { auth } from "features";

const OrdersPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        auth.hasToken().then((result) => !result && navigate("/app/login"));
    }, [navigate]);

    const orders = useQuery("orders", orderLib.getOrders);
    const isOnDesktop = useMediaQuery("(min-width: 600px)");

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

    const Row: FC<{ order: Order }> = ({ order }) => {
        const [open, setOpen] = useState(false);

        const address = `г. ${order.address.city.name}, ${order.address.street}, ${order.address.building}`;
        const total = `${order.orderItems.reduce(
            (sum: number, item: OrderItem) => sum + item.product.retailPrice * item.amount,
            0,
        )} ₽`;
        return (
            <>
                <TableRow key={order.id} onClick={() => setOpen(!open)}>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell>
                        {DateTime.fromISO(order.date.toLocaleString()).toLocaleString()}
                    </TableCell>
                    {isOnDesktop && <TableCell>{getStatusChip(order.status.name)}</TableCell>}
                    <TableCell>
                        {
                            <List disablePadding>
                                {order.orderItems.map((item: OrderItem) => (
                                    <ListItem key={item.id}>
                                        {item.product.name} ({item.amount}{" "}
                                        {item.product.isByWeight ? "кг." : "шт."})
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </TableCell>
                    {isOnDesktop && <TableCell>{address}</TableCell>}
                    {isOnDesktop && <TableCell>{total}</TableCell>}
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {!isOnDesktop && (
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Подробности о заказе
                                    </Typography>
                                    <Paper sx={{ maxWidth: 400 }}>
                                        <List>
                                            <ListItem>
                                                <ListItemText>Статус: </ListItemText>
                                                <ListItemIcon>
                                                    {getStatusChip(order.status.name)}
                                                </ListItemIcon>
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <LocationOnIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={"Адрес"}
                                                    secondary={address}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemIcon>
                                                    <PaymentsIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={"Итог"} secondary={total} />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </Box>
                            )}
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Действия
                                </Typography>
                                <Paper sx={{ maxWidth: 250, padding: 3 }}>
                                    <Stack spacing={2}>
                                        <Button
                                            color={"success"}
                                            variant={"outlined"}
                                            size={"small"}
                                            startIcon={<VisibilityIcon />}
                                            component={Link}
                                            to={`/app/orders/view/${order.id}`}
                                        >
                                            Просмотреть
                                        </Button>
                                        <Button
                                            color={"primary"}
                                            variant={"outlined"}
                                            size={"small"}
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/app/orders/edit/${order.id}`}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            color={"secondary"}
                                            variant={"outlined"}
                                            size={"small"}
                                            startIcon={<RouteIcon />}
                                        >
                                            Маршрут
                                        </Button>
                                        <Button
                                            color={"error"}
                                            variant={"outlined"}
                                            size={"small"}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Удалить
                                        </Button>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </>
        );
    };

    return (
        <>
            <Typography variant={"h4"}>Заказы</Typography>
            {orders.isLoading && <CircularProgress />}
            <Container maxWidth={"xl"}>
                {orders.data !== undefined && (
                    <Paper>
                        <TableContainer sx={{ overflowX: "initial" }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Дата</TableCell>
                                        {isOnDesktop && <TableCell>Статус</TableCell>}
                                        <TableCell>Содержимое</TableCell>
                                        {isOnDesktop && <TableCell>Адрес</TableCell>}
                                        {isOnDesktop && <TableCell>Итог</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orders.data.map((order: Order) => (
                                        <Row order={order} key={order.id} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={() => navigate("/app/orders/add")}
                    sx={{
                        position: "fixed",
                        bottom: 80,
                        right: 20,
                    }}
                >
                    <AddIcon />
                </Fab>
            </Container>
        </>
    );
};

export default OrdersPage;
