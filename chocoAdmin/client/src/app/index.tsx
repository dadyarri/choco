import { Container, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import React, { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { BrowserRouter } from "react-router-dom";

import { Routing } from "pages";
import { BottomNavigationContext } from "shared/contexts/bottom-navigation";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { MobileNavigation } from "shared/ui/mobile-navigation";

const App = () => {
    const queryClient = new QueryClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const [active, changeActive] = useState("home");

    return (
        <QueryClientProvider client={queryClient}>
            <CssBaseline />

            <BrowserRouter>
                <Suspense fallback={"Loading..."}>
                    <Container maxWidth={"xl"}>
                        <Routing />
                    </Container>
                    <BottomNavigationContext.Provider
                        value={{ active: active, changeActive: changeActive }}
                    >
                        {isMobile && <MobileNavigation />}
                    </BottomNavigationContext.Provider>
                </Suspense>
            </BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
