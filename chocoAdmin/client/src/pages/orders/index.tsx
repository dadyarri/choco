import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "features";

const OrdersPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken()) {
            navigate("/app/login");
        }
    }, [navigate]);

    return <Typography variant={"h4"}>Заказы</Typography>;
};

export default OrdersPage;
