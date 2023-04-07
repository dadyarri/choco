import React from 'react';
import {Route, Routes} from 'react-router-dom';
import routes from "../routes";
import 'react-toastify/dist/ReactToastify.min.css';
import {withProviders} from "./providers";

const App = () => {

    return (
        <Routes>
            {routes.map((route, index) => {
                const {element, ...rest} = route;
                return <Route key={index} {...rest} element={element}/>;
            })}
        </Routes>
    );
}

export default withProviders(App);
