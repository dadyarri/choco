import React, { createContext, FC, useState } from "react";

type BottomNavigationProps = {
    active: string;
    changeActive: React.Dispatch<React.SetStateAction<string>>;
};

type BottomNavigationContextProviderProps = {
    children: React.ReactNode;
};

export const BottomNavigationContext = createContext<BottomNavigationProps>({
    active: "",
    changeActive: () => {},
});

export const BottomNavigationContextProvider: FC<BottomNavigationContextProviderProps> = ({
    children,
}) => {
    const [active, setActive] = useState("home");

    const defaultValue = {
        active: active,
        changeActive: setActive,
    };

    return (
        <BottomNavigationContext.Provider value={defaultValue}>
            {children}
        </BottomNavigationContext.Provider>
    );
};
