import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Typography,
} from "@mui/material";
import React from "react";

export default () => {
    return (
        <>
            <Typography variant={"h2"}>Профиль</Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <Avatar
                                alt={"avatar"}
                                src={"https://www.dadyarri.ru/images/index/webp/avatar.webp"}
                            ></Avatar>
                        </ListItemIcon>
                        Привет, Даниил
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            Выйти
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                    <ListItem>
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
