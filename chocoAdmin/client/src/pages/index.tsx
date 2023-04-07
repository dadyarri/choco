import React from "react";
import {Route, Routes} from "react-router-dom";
import routes from "routes";

export const Routing = () => {
    return (
        <Routes>
            {routes.map((route, index) => {
                const {element, ...rest} = route;
                return <Route key={index} {...rest} element={element}/>;
            })}
        </Routes>
    );
};