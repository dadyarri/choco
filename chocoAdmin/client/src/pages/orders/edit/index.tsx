import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SaveIcon from "@mui/icons-material/Save";
import {
    Button,
    CircularProgress,
    InputLabel,
    MenuItem,
    Select,
    Stack,
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
                        city: order.data ? order.data.address.city.id : "",
                    }}
                    onSubmit={(values) => console.log(values)}
                >
                    {({ values, touched, errors, handleChange }) => (
                        <Form>
                            <Stack spacing={3} sx={{ width: { sm: "90%", md: 400 }, margin: 2 }}>
                                <InputLabel>Дата</InputLabel>
                                <Field
                                    as={DatePicker}
                                    name={"date"}
                                    id={"date"}
                                    variant={"outlined"}
                                    value={values.date}
                                    onChange={handleChange}
                                    label={"Дата заказа"}
                                    error={touched.date && errors.date}
                                    type={"date"}
                                    format={"dd.MM.yyyy"}
                                />
                                <InputLabel>Статус заказа</InputLabel>
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
                                <InputLabel>Город</InputLabel>
                                <Field
                                    as={Select}
                                    name={"city"}
                                    id={"city"}
                                    variant={"outlined"}
                                    label={"Город"}
                                    type={"select"}
                                    value={values.city}
                                    onChange={handleChange}
                                    error={touched.city && errors.city}
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
