import {
    Avatar,
    Box,
    Container,
    Flex,
    Heading,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Stack,
    Switch,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";

import routes from "routes/index";
import { getToken } from "services/jwt";

const NavMenu: FC = () => {
    const hasAuthData = !!getToken();
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Box position={"sticky"} as={"nav"} w={"100%"} zIndex={2}>
            <Container display={"flex"} p={2} maxW={"1500px"}>
                <Flex align={"center"} mr={5} flexGrow={1}>
                    <Heading
                        as={Link}
                        to={"/"}
                        size={"lg"}
                        letterSpacing={"tighter"}
                        style={{ userSelect: "none", cursor: "pointer" }}
                    >
                        Шокоадминка
                    </Heading>
                </Flex>

                {hasAuthData && (
                    <HStack>
                        <Stack
                            direction={{ base: "column", md: "row" }}
                            display={{ base: "none", md: "flex" }}
                            width={{ base: "full", md: "auto" }}
                            alignItems={"center"}
                            flexGrow={1}
                            mt={{ base: 4, md: 0 }}
                        >
                            {routes.map(
                                (route) =>
                                    route.label && (
                                        <Link to={route.path!} key={uuid()}>
                                            {route.label}
                                        </Link>
                                    ),
                            )}
                        </Stack>
                        <Box flex={1}>
                            <Box ml={2} display={{ base: "inline-block", md: "none" }}>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        icon={<GiHamburgerMenu />}
                                        variant={"outline"}
                                        aria-label={"Options"}
                                    ></MenuButton>
                                    <MenuList>
                                        {routes.map(
                                            (route) =>
                                                route.label && (
                                                    <MenuItem key={uuid()}>
                                                        <Link to={route.path!} key={uuid()}>
                                                            {route.label}
                                                        </Link>
                                                    </MenuItem>
                                                ),
                                        )}
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Box>
                        <Box flex={1}>
                            <Menu>
                                <MenuButton
                                    as={Avatar}
                                    name={localStorage.getItem("name")!}
                                    src={localStorage.getItem("avatarUri")!}
                                    size={"sm"}
                                />
                                <MenuList>
                                    <Text mx={3} my={2}>
                                        Привет, {localStorage.getItem("name")}
                                    </Text>
                                    <Flex justifyContent={"space-between"} mx={3} my={2}>
                                        <Text>Темная тема</Text>
                                        <Switch
                                            onChange={toggleColorMode}
                                            isChecked={colorMode === "dark"}
                                        />
                                    </Flex>
                                    <MenuDivider />
                                    <MenuItem
                                        onClick={() => {
                                            localStorage.removeItem("token");
                                            window.location.reload();
                                        }}
                                        icon={<BiLogOutCircle />}
                                    >
                                        Выйти
                                    </MenuItem>
                                    <Text fontSize={"xs"} as={"i"} mx={3} my={2}>
                                        Версия: 1.5.0-dev
                                    </Text>
                                </MenuList>
                            </Menu>
                        </Box>
                    </HStack>
                )}
            </Container>
        </Box>
    );
};

export default NavMenu;
