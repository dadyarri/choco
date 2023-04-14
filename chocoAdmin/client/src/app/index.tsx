import {
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { SnackbarProvider } from "notistack";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";

import { auth } from "features";
import { Routing } from "pages";
import { BottomNavigationContextProvider } from "shared/contexts/bottom-navigation";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import DesktopNavigation from "shared/ui/desktop-navigation";
import { MobileNavigation } from "shared/ui/mobile-navigation";

const App = () => {
    const queryClient = new QueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [hasToken, setHasToken] = useState(false);
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const themeString = (b: boolean) => (b ? "dark" : "light");
    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: themeString(prefersDarkMode),
                },
            }),
        [prefersDarkMode],
    );

    useEffect(() => {
        const f = async () => {
            setHasToken(await auth.hasToken());
        };

        f();
    }, [hasToken]);

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={muiTheme}>
                <SnackbarProvider
                    maxSnack={2}
                    autoHideDuration={2000}
                    anchorOrigin={{ horizontal: "right", vertical: "top" }}
                >
                    <QueryClientProvider client={queryClient}>
                        <CssBaseline />

                        <BrowserRouter>
                            <Suspense fallback={"Loading..."}>
                                {!isMobile && hasToken && <DesktopNavigation />}
                                <Container maxWidth={"xl"} sx={{ padding: 3, marginBottom: 10 }}>
                                    <Routing />
                                </Container>
                                <BottomNavigationContextProvider>
                                    {isMobile && hasToken && <MobileNavigation />}
                                </BottomNavigationContextProvider>
                            </Suspense>
                        </BrowserRouter>

                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </LocalizationProvider>
    );
};

export default App;
