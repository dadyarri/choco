import React, {FC} from "react";
import {Link} from "react-router-dom";
import routes from "../../routes/index";
import {v4 as uuid} from "uuid";
import {
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, Stack
} from "@chakra-ui/react";
import {GiHamburgerMenu} from "react-icons/gi";
import {getToken} from "../../services/jwt";

const NavMenu: FC = () => {

    const hasAuthData = !!getToken();

    return <Box
        position={"sticky"}
        as={"nav"}
        w={"100%"}
        bg={"#ffffff40"}
        zIndex={2}
    >
        <Container display={"flex"} p={2} maxW={"1500px"}>
            <Flex align={"center"} mr={5} flexGrow={1}>
                <Heading
                    as={Link}
                    to={"/"}
                    size={"lg"}
                    letterSpacing={"tighter"}
                    style={{userSelect: "none", cursor: "pointer"}}
                >
                    Шокоадминка
                </Heading>
            </Flex>

            {hasAuthData && <HStack>
                <Stack
                    direction={{base: "column", md: "row"}}
                    display={{base: "none", md: "flex"}}
                    width={{base: "full", md: "auto"}}
                    alignItems={"center"}
                    flexGrow={1}
                    mt={{base: 4, md: 0}}
                >
                    {routes.map((route) =>
                        route.label && <Link to={route.path!} key={uuid()}>{route.label}</Link>)
                        }
                </Stack>
                <Box flex={1}>
                    <Box ml={2} display={{base: "inline-block", md: "none"}}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<GiHamburgerMenu/>}
                                variant={"outline"}
                                aria-label={"Options"}
                            ></MenuButton>
                            <MenuList>
                                {routes.map((route) =>
                                    route.label &&
                                    <MenuItem key={uuid()}>
                                        <Link to={route.path!} key={uuid()}>{route.label}</Link>
                                    </MenuItem>)
                                    }
                            </MenuList>
                        </Menu>
                    </Box>
                </Box>
            </HStack>}
        </Container>
    </Box>
}

export default NavMenu;