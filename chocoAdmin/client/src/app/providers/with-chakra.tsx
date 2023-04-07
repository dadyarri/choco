import theme from "theme";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import React from "react";

export const withChakra = (component: () => React.ReactNode) => () => (
    <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
        {component()}
    </ChakraProvider>
);