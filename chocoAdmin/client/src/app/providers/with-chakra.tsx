import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";

import theme from "theme";

export const withChakra = (component: () => React.ReactNode) => () =>
    (
        <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            {component()}
        </ChakraProvider>
    );
