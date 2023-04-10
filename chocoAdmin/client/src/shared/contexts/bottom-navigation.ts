import { createContext, useState } from "react";

const [active, changeActive] = useState("home");

export const BottomNavigationContext = createContext({
    active: active,
    changeActive: changeActive,
});
