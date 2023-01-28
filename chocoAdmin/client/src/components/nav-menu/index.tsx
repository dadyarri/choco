import React, {FC} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

const NavMenu: FC = () => {

    return <Navbar className={"mx-3"} expand={"lg"} sticky={"top"}>
        <Navbar.Brand as={Link} to="/">Шокадминка</Navbar.Brand>
        <Navbar.Toggle/>
        <Navbar.Collapse>
            <Nav>
                <Nav.Link as={Link} className="text-dark" to="/">Главная</Nav.Link>
                <Nav.Link as={Link} className="text-dark" to="/orders">Заказы</Nav.Link>
                <Nav.Link as={Link} className="text-dark" to="/shipments">Поставки</Nav.Link>
                <Nav.Link as={Link} className="text-dark" to="/warehouse">Склад</Nav.Link>
                <Nav.Link as={Link} className="text-dark" to="/categories">Категории</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default NavMenu;