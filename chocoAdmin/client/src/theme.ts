import {extendTheme} from "@chakra-ui/react";
import {mode} from "@chakra-ui/theme-tools";

const theme = extendTheme(
    {
        config: {
            initialColorMode: "light",
            useSystemColorMode: false,
        },
        styles: {
            global: {
                body: {
                    bg: mode("whitealpha.800", "blackalpha.800")
                },
                nav: {
                    bg: mode("whitealpha.800", "blackalpha.800")
                }
            }
        }
    }
);

export default theme;