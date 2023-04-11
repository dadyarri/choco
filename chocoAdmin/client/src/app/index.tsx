import {
    Container,
    createTheme,
    CssBaseline,
    ThemeProvider,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { Suspense, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";

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

    return (
        <ThemeProvider theme={muiTheme}>
            <QueryClientProvider client={queryClient}>
                <CssBaseline />

                <BrowserRouter>
                    <Suspense fallback={"Loading..."}>
                        {!isMobile && <DesktopNavigation/>}
                        <Container maxWidth={"xl"} sx={{padding: 3}}>
                            <Routing />
                        </Container>
                        <BottomNavigationContextProvider>
                            {isMobile && <MobileNavigation />}
                        </BottomNavigationContextProvider>
                    </Suspense>
                </BrowserRouter>

                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    );
};

export default App;
