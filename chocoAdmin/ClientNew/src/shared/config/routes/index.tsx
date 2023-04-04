import React from "react";
import {Route} from "../../../entities/route";
import {HomePage} from "../../../pages/home";

const routes: Route[] = [
  {
    index: true,
    path: "/",
    element: <HomePage/>,
  }
];

export default routes;