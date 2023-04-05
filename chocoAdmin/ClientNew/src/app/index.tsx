import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {Route, Routes} from "react-router-dom";
import routes from "../shared/config/routes";
import {withProviders} from "./providers";

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {routes.map((route) => {
          const {element, key, ...rest} = route;
          return <Route key={key} {...rest} element={element}/>;
        })}
      </Routes>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default withProviders(App);
