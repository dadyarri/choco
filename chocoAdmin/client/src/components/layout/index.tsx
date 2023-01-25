import {FC} from "react";
import {Container} from "react-bootstrap";
import LayoutProps from "./index.specs";
import NavMenu from "../nav-menu";

const Layout: FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <NavMenu/>
            <Container as={"main"}>
                {children}
            </Container>
        </div>
    )
}

export default Layout;