import React, {FC} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import routes from "../../routes/index";
import {v4 as uuid} from "uuid";

const NavMenu: FC = () => {

    return <Navbar className={"mx-3"} expand={"lg"} sticky={"top"}>
        <Navbar.Brand as={Link} to="/">Шокадминка</Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse>
            <Nav>
                {routes.map((route) =>
                    route.label && <Nav.Link as={Link} to={route.path!} key={uuid()}>{route.label}</Nav.Link>)
                }
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default NavMenu;