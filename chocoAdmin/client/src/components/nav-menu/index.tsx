import React, {FC} from "react";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";

const NavMenu: FC = () => {

    return <Navbar className={"mx-3"} expand={"lg"}>
        <Navbar.Brand as={Link} to="/">Шокадминка</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
            <Nav>
                <NavItem>
                    <Nav.Link as={Link} className="text-dark" to="/">Главная</Nav.Link>
                </NavItem>
                <NavItem>
                    <Nav.Link as={Link} className="text-dark" to="/orders">Заказы</Nav.Link>
                </NavItem>
                <NavItem>
                    <Nav.Link as={Link} className="text-dark" to="/shipments">Поставки</Nav.Link>
                </NavItem>
                <NavItem>
                    <Nav.Link as={Link} className="text-dark" to="/warehouse">Склад</Nav.Link>
                </NavItem>
                <NavItem>
                    <Nav.Link as={Link} className="text-dark" to="/categories">Категории</Nav.Link>
                </NavItem>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default NavMenu;