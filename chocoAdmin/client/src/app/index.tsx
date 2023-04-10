import BackupIcon from "@mui/icons-material/Backup";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import HomeIcon from "@mui/icons-material/Home";
import {
    Avatar,
    BottomNavigation,
    BottomNavigationAction,
    Container,
    CssBaseline,
    Paper,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter, Link } from "react-router-dom";

import { Routing } from "pages";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const App = () => {
    const queryClient = new QueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [value, setValue] = useState("recents");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <CssBaseline />

            <BrowserRouter>
                <Suspense fallback={"Loading..."}>
                    <Container maxWidth={"xl"}>
                        <Routing />
                    </Container>
                    {isMobile && (
                        <Paper
                            sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
                            elevation={3}
                        >
                            <BottomNavigation value={value} onChange={handleChange}>
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
                                            src={
                                                "https://www.dadyarri.ru/images/index/webp/avatar.webp"
                                            }
                                            sx={{ width: 24, height: 24 }}
                                        />
                                    }
                                />
                            </BottomNavigation>
                        </Paper>
                    )}
                </Suspense>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
