import {ReactNode} from "react";

type Route = {
    index?: boolean;
    element: ReactNode;
    path?: string;
    label?: string;
}

export default Route;