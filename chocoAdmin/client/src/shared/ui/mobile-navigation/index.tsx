import BackupIcon from "@mui/icons-material/Backup";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import HomeIcon from "@mui/icons-material/Home";
import { Avatar, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { BottomNavigationContext } from "shared/contexts/bottom-navigation";

export const MobileNavigation = () => {
    const { active, changeActive } = useContext(BottomNavigationContext);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        changeActive(newValue);
    };

    return (
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation value={active} onChange={handleChange}>
                <BottomNavigationAction
                    label={"Главная"}
                    value={"home"}
                    icon={<HomeIcon />}
                    component={Link}
                    to={"/app"}
                />
                <BottomNavigationAction
                    label={"Заказы"}
                    value={"orders"}
                    icon={<CloudDownloadIcon />}
                    component={Link}
                    to={"/app/orders"}
                />
                <BottomNavigationAction
                    label="Поставки"
                    value={"shipments"}
                    icon={<BackupIcon />}
                    component={Link}
                    to={"/app/shipments"}
                />
                <BottomNavigationAction
                    label="Склад"
                    value={"warehouse"}
                    icon={<CloudIcon />}
                    component={Link}
                    to={"/app/warehouse"}
                />
                <BottomNavigationAction
                    label={"Профиль"}
                    value={"profile"}
                    component={Link}
                    to={"/app/profile"}
                    icon={
                        <Avatar
                            alt={"Avatar"}
                            src={"https://www.dadyarri.ru/images/index/webp/avatar.webp"}
                            sx={{ width: 24, height: 24 }}
                        />
                    }
                />
            </BottomNavigation>
        </Paper>
    );
};
