import React from "react";

import "react-toastify/dist/ReactToastify.min.css";
import { Routing } from "pages";

import { withProviders } from "./providers";

const App = () => {
    return <Routing />;
};

export default withProviders(App);
