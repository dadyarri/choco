import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditRoadIcon from "@mui/icons-material/EditRoad";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SaveIcon from "@mui/icons-material/Save";
import ViewTimelineIcon from "@mui/icons-material/ViewTimeline";
import {
    Button,
    CircularProgress,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Field, Form, Formik } from "formik";
import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import { orderCityLib, orderLib, orderStatusLib } from "entities";
import { auth } from "features";

const OrderEditPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        auth.hasToken().then((result) => !result && navigate("/app/login"));
    }, [navigate]);

    const { orderId } = useParams();

    const editMode = Boolean(orderId);

    const order = useQuery(["order", orderId], () => orderLib.getOrderById(orderId!), {
        enabled: editMode,
    });

    const orderStatuses = useQuery("orderStatuses", orderStatusLib.getOrderStatuses);

    const orderCities = useQuery("orderCities", orderCityLib.getOrderCities);

    return (
        <>
            <Typography variant={"h4"} sx={{ marginBottom: 2 }}>
                {editMode ? "Редактирование" : "Создание"} заказа
            </Typography>
            <Button
                sx={{ marginBottom: 2 }}
                color={"secondary"}
                variant={"outlined"}
                component={Link}
                startIcon={<ChevronLeftIcon />}
                to={"/app/orders"}
            >
                Назад
            </Button>
            {order.isLoading ? (
                <CircularProgress />
            ) : (
                <Formik
                    initialValues={{
                        date: order.data
                            ? DateTime.fromFormat(order.data.date, "yyyy-MM-dd")
                            : DateTime.now(),
                        status: order.data ? order.data.status.id : "",
                        address: {
                            city: order.data ? order.data.address.city.id : "",
                            street: order.data ? order.data.address.street : "",
                            building: order.data ? order.data.address.building : "",
                        },
                    }}
                    onSubmit={(values) => console.log(values)}
                >
                    {({ values, touched, errors, handleChange, setFieldValue }) => (
                        <Form>
                            <Stack spacing={3} sx={{ width: { sm: "90%", md: 400 }, margin: 2 }}>
                                <InputLabel>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <CalendarMonthIcon sx={{ marginRight: 1 }} />{" "}
                                        <span>Дата</span>
                                    </Typography>
                                </InputLabel>
                                <Field
                                    as={DatePicker}
                                    name={"date"}
                                    id={"date"}
                                    variant={"outlined"}
                                    value={values.date}
                                    onChange={(value: any) => setFieldValue("date", value, true)}
                                    label={"Дата заказа"}
                                    error={touched.date && errors.date}
                                    type={"date"}
                                    format={"dd.MM.yyyy"}
                                />
                                <InputLabel>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <ViewTimelineIcon sx={{ marginRight: 1 }} />{" "}
                                        <span>Статус заказа</span>
                                    </Typography>
                                </InputLabel>
                                <Field
                                    as={Select}
                                    name={"status"}
                                    id={"status"}
                                    variant={"outlined"}
                                    label={"Статус заказа"}
                                    type={"select"}
                                    value={values.status}
                                    onChange={handleChange}
                                    error={touched.status && errors.status}
                                >
                                    <MenuItem defaultChecked disabled>
                                        -- Выберите статус --
                                    </MenuItem>
                                    {orderStatuses.data &&
                                        orderStatuses.data.map((status) => (
                                            <MenuItem value={status.id} key={status.id}>
                                                {status.name}
                                            </MenuItem>
                                        ))}
                                </Field>
                                <InputLabel>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <LocationCityIcon sx={{ marginRight: 1 }} />{" "}
                                        <span>Город</span>
                                    </Typography>
                                </InputLabel>
                                {!orderCities.isLoading && (
                                    <Field
                                        as={Select}
                                        name={"address.city"}
                                        id={"city"}
                                        variant={"outlined"}
                                        label={"Город"}
                                        type={"select"}
                                        value={values.address.city}
                                        onChange={handleChange}
                                        error={touched.address?.city && errors.address?.city}
                                    >
                                        <MenuItem defaultChecked disabled>
                                            -- Выберите город --
                                        </MenuItem>
                                        {orderCities.data &&
                                            orderCities.data.map((city) => (
                                                <MenuItem value={city.id} key={city.id}>
                                                    {city.name}
                                                </MenuItem>
                                            ))}
                                    </Field>
                                )}
                                <InputLabel>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <EditRoadIcon sx={{ marginRight: 1 }} /> <span>Улица</span>
                                    </Typography>
                                </InputLabel>
                                <Field
                                    as={TextField}
                                    name={"address.street"}
                                    id={"street"}
                                    label={"Улица"}
                                    value={values.address.street}
                                />
                                <InputLabel>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <HomeIcon sx={{ marginRight: 1 }} /> <span>Дом</span>
                                    </Typography>
                                </InputLabel>
                                <Field
                                    as={TextField}
                                    name={"address.building"}
                                    id={"building"}
                                    label={"Дом"}
                                    value={values.address.building}
                                />
                                <Button
                                    type={"submit"}
                                    variant={"outlined"}
                                    startIcon={<SaveIcon />}
                                >
                                    Сохранить
                                </Button>
                            </Stack>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default OrderEditPage;
