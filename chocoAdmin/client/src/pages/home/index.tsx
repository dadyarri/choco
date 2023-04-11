import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "features";

export default () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken()) {
            navigate("/app/login");
        }
    }, []);

    return <Typography variant={"h4"}>Главная</Typography>;
};
