import React, {FC} from "react";
import LayoutProps from "./index.specs";
import NavMenu from "../nav-menu";
import {Container, useColorMode} from "@chakra-ui/react";
import {ToastContainer} from "react-toastify";

const Layout: FC<LayoutProps> = ({ children }) => {


    const {colorMode} = useColorMode();
    console.log(`colorMode: ${colorMode}`);

    return (
        <div>
            <NavMenu/>
            <Container as={"main"} maxW={"1300px"}>
                {children}
            </Container>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={colorMode}
            />
        </div>
    )
}

export default Layout;