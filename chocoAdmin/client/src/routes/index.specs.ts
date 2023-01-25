import {ReactNode} from "react";

type Route = {
    index?: boolean;
    element: ReactNode;
    path?: string
}

export default Route;