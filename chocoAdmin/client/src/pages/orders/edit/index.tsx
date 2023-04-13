import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import { auth } from "features";

const OrderEditPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken()) {
            navigate("/app/login");
        }
    }, [navigate]);

    const { orderId } = useParams();

    const editMode = Boolean(orderId);

    return (
        <>
            <Typography variant={"h4"}>
                {editMode ? "Редактирование" : "Создание"} заказа
            </Typography>
        </>
    );
};

export default OrderEditPage;
