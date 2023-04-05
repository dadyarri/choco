import React, {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {Route, Routes} from "react-router-dom";
import {Route as RouteType} from "../entities/route";
import {AppWrapper} from "../shared/config/app-wrapper";
import routes from "../shared/config/routes";
import {withProviders} from "./providers";
import "./index.css";

function App() {

  const queryClient = new QueryClient();

  const renderRoutes = (routes: RouteType[]): ReactNode => {
    return routes.map((item) => {
      return <Route key={item.path} path={item.path} element={item.element}/>;
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<AppWrapper/>}>
          {renderRoutes(routes)}
        </Route>
      </Routes>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
}

export default withProviders(App);
