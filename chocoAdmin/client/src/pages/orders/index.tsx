import {Box, Button, ButtonGroup, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {AxiosError} from "axios";
import {DateTime} from "luxon";
import React from "react";
import {FaMapMarkerAlt} from "react-icons/fa";
import {GiCancel, GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {MdRestoreFromTrash} from "react-icons/md";
import {TbTruckDelivery} from "react-icons/tb";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Link} from "react-router-dom";
import {BeatLoader} from "react-spinners";

import {Order} from "entities/order";
import StatefulButton from "shared/ui/stateful-button";

import {deleteOrder, fetchOrdersList, requestRouteLink, restoreFromDeleted} from "./index.utils";

const Orders = () => {

    const {isLoading, isError, data, error} = useQuery<Order[], AxiosError>("orders", fetchOrdersList);

    const getOrderStatusIcon = (status: string) => {
        switch (status) {
            case "Выполнен": {
                return <GiCheckMark/>;
            }
            case "Доставляется": {
                return <TbTruckDelivery/>;
            }
            case "Обрабатывается": {
                return <GiSandsOfTime/>;
            }
            case "Отменён": {
                return <GiCancel/>;
            }
            default: {
                return null;
            }
        }
    };

    const deleteOrderMutation = useMutation(
        "deleteOrder",
        (orderId: string) => deleteOrder(orderId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("orders");

            }
        }
    );

    const restoreFromDeletedMutation = useMutation(
        "restoreDeletedOrder",
        (orderId: string) => restoreFromDeleted(orderId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("orders");
            }
        }
    );

    const plotRoute = async (address: string) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {latitude, longitude} = position.coords;
                requestRouteLink(address, latitude, longitude);
            });
        }
    };

    const queryClient = useQueryClient();

    return (
        isLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Заказы</Heading>
                    <Button as={Link} leftIcon={<HiPlus/>} colorScheme={"green"} to={"/orders/add"} mb={4}>
                        Создать
                    </Button>
                    {data !== undefined && data.length > 0 ?
                        <TableContainer>
                            <Table variant={"striped"} colorScheme={"gray"}>
                                <Thead>
                                    <Tr>
                                        <Th>Дата</Th>
                                        <Th>Содержимое заказа</Th>
                                        <Th>Адрес</Th>
                                        <Th>Итог</Th>
                                        <Th>Статус</Th>
                                        <Th>Действия</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.map((order: Order) => {
                                        const address = `г. ${order.address.city.name}, ${order.address.street}, ${order.address.building}`;
                                        return !order.deleted && <Tr key={order.id}>
                                            <Td>
                                                {DateTime.fromISO(order.date.toString()).toFormat("dd.MM.yyyy")}
                                            </Td>

                                            <Td>
                                                <ul>
                                                    {order.orderItems.map(item => <li
                                                        key={item.id}>{item.product.name} x{item.amount}</li>
                                                    )}
                                                </ul>
                                            </Td>
                                            <Td>{address}</Td>
                                            <Td>
                                                {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                                            </Td>
                                            <Td title={order.status.name}>
                                                {getOrderStatusIcon(order.status.name)}
                                            </Td>
                                            <Td>
                                                <ButtonGroup>
                                                    <Button
                                                        as={Link}
                                                        colorScheme={"blue"}
                                                        title={"Редактировать"}
                                                        type={"button"}
                                                        to={`/orders/edit/${order.id}`}
                                                    >
                                                        <HiPencil/>
                                                    </Button>
                                                    <StatefulButton
                                                        variant={"red"}
                                                        title={"Удалить"}
                                                        prefix={<HiOutlineTrash/>}
                                                        postfixWhenActive={"Удалить?"}
                                                        clickHandler={async (_event) => {
                                                            deleteOrderMutation.mutate(order.id);
                                                        }}/>
                                                    <Button colorScheme={"purple"} title={"Построить маршрут"}
                                                            onClick={() => plotRoute(address)}>
                                                        <FaMapMarkerAlt/>
                                                    </Button>
                                                </ButtonGroup>
                                            </Td>
                                        </Tr>;
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <Heading as={"h3"} size={"md"}>Нет заказов</Heading>
                    }
                    {data?.some(el => el.deleted) && <Box mt={4}>
                        <Heading as={"h1"}>Удалённые заказы</Heading>
                        {data !== undefined && data.length > 0 &&
                            <TableContainer>
                                <Table variant={"striped"} colorScheme={"gray"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Дата</Th>
                                            <Th>Статус</Th>
                                            <Th>Содержимое заказа</Th>
                                            <Th>Адрес</Th>
                                            <Th>Итог</Th>
                                            <Th>Действия</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.map((order: Order) => (
                                            order.deleted && <Tr key={order.id}>
                                                <Td>
                                                    {DateTime.fromISO(order.date.toString()).toFormat("dd.MM.yyyy")}
                                                </Td>
                                                <Td title={order.status.name}>
                                                    {getOrderStatusIcon(order.status.name)}
                                                </Td>

                                                <Td>
                                                    <ul>
                                                        {order.orderItems.map(item => <li
                                                            key={item.id}>{item.product.name} x{item.amount}</li>
                                                        )}
                                                    </ul>
                                                </Td>
                                                <Td>г. {order.address.city.name}, {order.address.street}, {order.address.building}</Td>
                                                <Td>
                                                    {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                                                </Td>
                                                <Td>
                                                    <StatefulButton
                                                        variant={"blue"}
                                                        title={"Восстановить"}
                                                        prefix={<MdRestoreFromTrash/>}
                                                        postfixWhenActive={"Восстановить?"}
                                                        clickHandler={
                                                            async () => {
                                                                restoreFromDeletedMutation.mutate(order.id);
                                                            }
                                                        }
                                                    />
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        }
                    </Box>
                    }
                </div>
    );
};

export default Orders;