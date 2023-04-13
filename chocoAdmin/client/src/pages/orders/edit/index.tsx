import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";

import { orderLib } from "entities";
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
            {order.isLoading && <CircularProgress />}
            {order.data && (
                <Formik initialValues={{}} onSubmit={(values) => console.log(values)}>
                    <Form></Form>
                </Formik>
            )}
        </>
    );
};

export default OrderEditPage;
