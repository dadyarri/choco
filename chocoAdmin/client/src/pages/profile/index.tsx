import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();

    const handleClickLogout = () => {
        localStorage.removeItem("token");
        navigate("/app/login");
    };

    return (
        <>
            <Typography variant={"h4"}>Профиль</Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                                alt={"avatar"}
                                src={"https://www.dadyarri.ru/images/index/webp/avatar.webp"}
                            ></Avatar>
                        </ListItemAvatar>
                        Привет, Даниил
                    </ListItem>
                    <ListItem sx={{ paddingX: 0 }}>
                        <ListItemButton onClick={handleClickLogout}>
                            <ListItemAvatar>
                                <LogoutIcon />
                            </ListItemAvatar>
                            Выйти
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ marginY: 2 }}>
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <i>Версия 1.5.0-dev</i>
                    </ListItem>
                </List>
            </Box>
        </>
    );
};
