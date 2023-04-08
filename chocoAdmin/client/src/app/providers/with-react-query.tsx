import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

export const withReactQuery = (component: () => React.ReactNode) => () => {

    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>
        {component()}
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>;
};