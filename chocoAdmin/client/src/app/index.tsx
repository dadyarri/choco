import React from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import {withProviders} from "./providers";
import {Routing} from "pages";

const App = () => {

    return (
        <Routing/>
    );
}

export default withProviders(App);
