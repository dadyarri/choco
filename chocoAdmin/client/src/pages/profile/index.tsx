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
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "features";

const ProfilePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.hasToken()) {
            navigate("/app/login");
        }
    }, [navigate]);

    const handleClickLogout = () => {
        auth.removeAuthData();
    };

    const profileData = auth.getProfileData();

    return (
        <>
            <Typography variant={"h4"}>Профиль</Typography>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar
                              alt={"avatar"}
                              component={Link}
                              to={"/app/profile"}
                              src={profileData.avatarUri}
                            >{!profileData.avatarUri && profileData.name && profileData.name[0]}</Avatar>
                        </ListItemAvatar>
                        Привет, {profileData.name}
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

export default ProfilePage;
