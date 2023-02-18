import {FC} from "react";
import LayoutProps from "./index.specs";
import NavMenu from "../nav-menu";
import {Container} from "@chakra-ui/react";

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <NavMenu/>
            <Container as={"main"} maxW={"1300px"} m={3}>
                {children}
            </Container>
        </div>
    )
}

export default Layout;