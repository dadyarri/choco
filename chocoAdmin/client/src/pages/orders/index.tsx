import {useQuery} from "react-query";
import {AxiosError} from "axios";
import {Order} from "../../services/types";
import {fetchOrdersList} from "./index.utils";
import {BeatLoader} from "react-spinners";
import {Button, ButtonGroup, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import {Link} from "react-router-dom";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import React from "react";
import {DateTime} from "luxon";
import StatefulButton from "../../components/stateful-button";
import {GiCancel, GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";

const Orders = () => {

    const {isLoading, isError, data, error} = useQuery<Order[], AxiosError>("orders", fetchOrdersList);

    const getOrderStatusIcon = (status: string) => {
        switch (status) {
            case "Выполнен": {
                return <GiCheckMark/>
            }
            case "Доставляется": {
                return <TbTruckDelivery/>
            }
            case "Обрабатывается": {
                return <GiSandsOfTime/>
            }
            case "Отменён": {
                return <GiCancel/>
            }
            default: {
                return null
            }
        }
    }

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
                                        <Th>Статус</Th>
                                        <Th>Содержимое заказа</Th>
                                        <Th>Адрес</Th>
                                        <Th>Итог</Th>
                                        <Th>Действия</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.map((order: Order) => (
                                        !order.deleted && <Tr key={order.id}>
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
                                                <ButtonGroup>
                                                    <Button
                                                        as={Link}
                                                        colorScheme={"blue"}
                                                        title={"Редактировать"}
                                                        type={"button"}
                                                        to={`/orders/edit/${order.id}`}
                                                        className={"btn btn-primary"}
                                                    >
                                                        <HiPencil/>
                                                    </Button>
                                                    <StatefulButton
                                                        variant={"red"}
                                                        title={"Удалить"}
                                                        prefix={<HiOutlineTrash/>}
                                                        postfixWhenActive={"Удалить?"}
                                                        clickHandler={async (_event) => {
                                                            // await deleteProductMutation.mutate(product.id)
                                                        }}/>
                                                </ButtonGroup>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <Heading as={"h3"} size={"md"}>Нет заказов</Heading>
                    }
                </div>
    )
}

export default Orders;