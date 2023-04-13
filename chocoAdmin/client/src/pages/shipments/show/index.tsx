import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Collapse,
    Container,
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

import { Shipment, ShipmentItem, shipmentLib } from "entities";
import { auth } from "features";

const ShipmentsPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        auth.hasToken().then((result) => !result && navigate("/app/login"));
    }, [navigate]);

    const shipments = useQuery("shipments", shipmentLib.getShipments);
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
            case "Выполнена": {
                color = "success";
                icon = <CheckCircleOutlineIcon />;
                break;
            }
            case "Отменена": {
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

    const Row: FC<{ shipment: Shipment }> = ({ shipment }) => {
        const [open, setOpen] = useState(false);

        const total = `${shipment.shipmentItems.reduce(
            (sum: number, item: ShipmentItem) => sum + item.product.retailPrice * item.amount,
            0,
        )} ₽`;
        return (
            <>
                <TableRow key={shipment.id} onClick={() => setOpen(!open)}>
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
                        {DateTime.fromISO(shipment.date.toLocaleString()).toLocaleString()}
                    </TableCell>
                    {isOnDesktop && <TableCell>{getStatusChip(shipment.status.name)}</TableCell>}
                    <TableCell>
                        {
                            <List disablePadding>
                                {shipment.shipmentItems.map((item: ShipmentItem) => (
                                    <ListItem key={item.id}>
                                        {item.product.name} ({item.amount}{" "}
                                        {item.product.isByWeight ? "кг." : "шт."})
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </TableCell>
                    {isOnDesktop && <TableCell>{total}</TableCell>}
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            {!isOnDesktop && (
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Подробности о поставке
                                    </Typography>
                                    <Paper sx={{ maxWidth: 400 }}>
                                        <List>
                                            <ListItem>
                                                <ListItemText>Статус: </ListItemText>
                                                <ListItemIcon>
                                                    {getStatusChip(shipment.status.name)}
                                                </ListItemIcon>
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
                                            to={`/app/shipments/view/${shipment.id}`}
                                        >
                                            Просмотреть
                                        </Button>
                                        <Button
                                            color={"primary"}
                                            variant={"outlined"}
                                            size={"small"}
                                            startIcon={<EditIcon />}
                                            component={Link}
                                            to={`/app/shipments/edit/${shipment.id}`}
                                        >
                                            Редактировать
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
            <Typography variant={"h4"}>Поставки</Typography>
            {shipments.isLoading && <CircularProgress />}
            <Container maxWidth={"xl"}>
                {shipments.data !== undefined && (
                    <Paper>
                        <TableContainer sx={{ overflowX: "initial" }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Дата</TableCell>
                                        {isOnDesktop && <TableCell>Статус</TableCell>}
                                        <TableCell>Содержимое</TableCell>
                                        {isOnDesktop && <TableCell>Итог</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {shipments.data.map((shipment: Shipment) => (
                                        <Row shipment={shipment} key={shipment.id} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Container>
        </>
    );
};

export default ShipmentsPage;
