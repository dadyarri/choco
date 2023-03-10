import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { Shipment } from "../../services/types";
import { deleteShipment, fetchShipmentsList, restoreFromDeleted } from "./index.utils";
import { BeatLoader } from "react-spinners";
import { Box, Button, ButtonGroup, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { HiOutlineTrash, HiPencil, HiPlus } from "react-icons/hi";
import React from "react";
import { DateTime } from "luxon";
import StatefulButton from "../../components/stateful-button";
import { GiCancel, GiCheckMark, GiSandsOfTime } from "react-icons/gi";
import { TbTruckDelivery } from "react-icons/tb";
import { MdRestoreFromTrash } from "react-icons/md";

const Shipments = () => {

    const { isLoading, isError, data, error } = useQuery<Shipment[], AxiosError>("shipments", fetchShipmentsList);

    const getShipmentStatusIcon = (status: string) => {
        switch (status) {
            case "Выполнена": {
                return <GiCheckMark />
            }
            case "Доставляется": {
                return <TbTruckDelivery />
            }
            case "Обрабатывается": {
                return <GiSandsOfTime />
            }
            case "Отменена": {
                return <GiCancel />
            }
            default: {
                return null
            }
        }
    }

    const deleteShipmentMutation = useMutation(
        "deleteShipment",
        (shipmentId: string) => deleteShipment(shipmentId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("shipments");

            }
        }
    )

    const restoreFromDeletedMutation = useMutation(
        "restoreDeletedShipments",
        (shipmentsId: string) => restoreFromDeleted(shipmentsId),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries("shipments");
            }
        }
    )

    const queryClient = useQueryClient();

    return (
        isLoading ?
            <BeatLoader color={"#36d7b7"} /> :
            isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Поставки</Heading>
                    <Button as={Link} leftIcon={<HiPlus />} colorScheme={"green"} to={"/shipments/add"} mb={4}>
                        Создать
                    </Button>
                    {data !== undefined && data.length > 0 ?
                        <TableContainer>
                            <Table variant={"striped"} colorScheme={"gray"}>
                                <Thead>
                                    <Tr>
                                        <Th>Дата</Th>
                                        <Th>Содержимое поставки</Th>
                                        <Th>Итог</Th>
                                        <Th>Статус</Th>
                                        <Th>Действия</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {data?.map((shipment: Shipment) => (
                                        !shipment.deleted && <Tr key={shipment.id}>
                                            <Td>
                                                {DateTime.fromISO(shipment.date.toString()).toFormat("dd.MM.yyyy")}
                                            </Td>

                                            <Td>
                                                <ul>
                                                    {shipment.shipmentItems.map(item => <li
                                                        key={item.id}>{item.product.name} x{item.amount}</li>
                                                        )}
                                                </ul>
                                            </Td>
                                            <Td>
                                                {shipment.shipmentItems.reduce((sum, item) => sum + item.product.wholesalePrice * item.amount, 0)}&nbsp;&#8381;
                                            </Td>
                                            <Td title={shipment.status.name}>
                                                {getShipmentStatusIcon(shipment.status.name)}
                                            </Td>
                                            <Td>
                                                <ButtonGroup>
                                                    <Button
                                                        as={Link}
                                                        colorScheme={"blue"}
                                                        title={"Редактировать"}
                                                        type={"button"}
                                                        to={`/shipments/edit/${shipment.id}`}
                                                    >
                                                        <HiPencil />
                                                    </Button>
                                                    <StatefulButton
                                                        variant={"red"}
                                                        title={"Удалить"}
                                                        prefix={<HiOutlineTrash />}
                                                        postfixWhenActive={"Удалить?"}
                                                        clickHandler={async (_event) => {
                                                            deleteShipmentMutation.mutate(shipment.id);
                                                        }} />
                                                </ButtonGroup>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        :
                        <Heading as={"h3"} size={"md"}>Нет поставок</Heading>
                    }
                    {data?.some(el => el.deleted) && <Box mt={4}>
                        <Heading as={"h1"}>Удалённые поставки</Heading>
                        {data !== undefined && data.length > 0 &&
                            <TableContainer>
                                <Table variant={"striped"} colorScheme={"gray"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Дата</Th>
                                            <Th>Статус</Th>
                                            <Th>Содержимое заказа</Th>
                                            <Th>Итог</Th>
                                            <Th>Действия</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {data?.map((shipment: Shipment) => (
                                            shipment.deleted && <Tr key={shipment.id}>
                                                <Td>
                                                    {DateTime.fromISO(shipment.date.toString()).toFormat("dd.MM.yyyy")}
                                                </Td>
                                                <Td title={shipment.status.name}>
                                                    {getShipmentStatusIcon(shipment.status.name)}
                                                </Td>

                                                <Td>
                                                    <ul>
                                                        {shipment.shipmentItems.map(item => <li
                                                            key={item.id}>{item.product.name} x{item.amount}</li>
                                                        )}
                                                    </ul>
                                                </Td>
                                                <Td>
                                                    {shipment.shipmentItems.reduce((sum, item) => sum + item.product.wholesalePrice * item.amount, 0)}&nbsp;&#8381;
                                                </Td>
                                                <Td>
                                                    <StatefulButton
                                                        variant={"blue"}
                                                        title={"Восстановить"}
                                                        prefix={<MdRestoreFromTrash />}
                                                        postfixWhenActive={"Восстановить?"}
                                                        clickHandler={
                                                            async () => {
                                                                restoreFromDeletedMutation.mutate(shipment.id);
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
    )
}

export default Shipments;