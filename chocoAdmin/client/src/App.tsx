import React, {FC} from 'react';
import {Route, Routes} from 'react-router-dom';
import Layout from "./components/layout";
import routes from "./routes";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import {ChakraProvider} from "@chakra-ui/react";
import theme from "./theme";

const App: FC = () => {

    const queryClient = new QueryClient();

    return (
        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Layout>
                    <Routes>
                        {routes.map((route, index) => {
                            const {element, ...rest} = route;
                            return <Route key={index} {...rest} element={element}/>;
                        })}
                    </Routes>
                </Layout>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default App;
