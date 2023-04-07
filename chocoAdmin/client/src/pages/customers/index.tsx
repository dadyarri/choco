import React, {FC} from "react";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {BeatLoader} from "react-spinners";
import {Customer} from "../../services/types";
import {HiOutlineTrash, HiPencil, HiPlus} from "react-icons/hi";
import {AxiosError} from "axios";
import {deleteCustomer, fetchCustomersList, restoreCustomer,} from "./index.utils";
import StatefulButton from "../../components/stateful-button";
import {Link} from "react-router-dom";
import {
    Button,
    ButtonGroup,
    Heading,
    ListItem,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    UnorderedList
} from "@chakra-ui/react";
import {MdRestoreFromTrash} from "react-icons/md";

const Customers: FC = () => {

    const customersList = useQuery<Customer[], AxiosError>(
        'customers',
        fetchCustomersList,
    )
    const queryClient = useQueryClient();
    const deleteCustomerMutation = useMutation((id: string) => {
        return deleteCustomer(id)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("customers")
        }
    });

    const restoreCustomerMutation = useMutation((id: string) => {
        return restoreCustomer(id)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("customers")
        }
    });

    return (
        customersList.isLoading ?
            <BeatLoader color="#36d7b7"/> :
            customersList.isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{customersList.error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>Клиенты</Heading>
                    <Button as={Link} leftIcon={<HiPlus/>} colorScheme={"green"} to={"/customers/add"} mb={4}>
                        Создать
                    </Button>
                    {customersList.data !== undefined && customersList.data.some(p => !p.deleted) &&
                        <TableContainer>
                            <Table variant={"striped"} colorScheme={"gray"}>
                                <Thead>
                                    <Tr>
                                        <Th>Фамилия</Th>
                                        <Th>Имя</Th>
                                        <Th>Телефон</Th>
                                        <Th>Адреса</Th>
                                        <Th>Действия</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {customersList.data?.map((customer: Customer) =>
                                        (!customer.deleted && <Tr key={customer.id}>
                                            <Td>{customer.lastName}</Td>
                                            <Td>{customer.firstName}</Td>
                                            <Td><Link to={`tel:${customer.phone}`}>{customer.phone}</Link></Td>
                                            <Td>
                                                <UnorderedList>
                                                    {customer.addresses.map((address) =>
                                                        <ListItem
                                                            key={address.id}>г. {address.city.name}, {address.street}, {address.building}
                                                        </ListItem>)
                                                    }
                                                </UnorderedList>
                                            </Td>
                                            <Td>
                                                <ButtonGroup>
                                                    <Button
                                                        as={Link}
                                                        colorScheme={"blue"}
                                                        title={"Редактировать"}
                                                        type={"button"}
                                                        to={`/customers/edit/${customer.id}`}
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
                                                            await deleteCustomerMutation.mutate(customer.id)
                                                        }}/>
                                                </ButtonGroup>
                                            </Td>

                                        </Tr>))}
                                </Tbody>
                            </Table>
                        </TableContainer>}

                    {customersList.data?.some(p => p.deleted) &&
                        <>
                            <Heading as={"h1"} mb={4}>Удалённые товары</Heading>
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Фамилия</Th>
                                            <Th>Имя</Th>
                                            <Th>Телефон</Th>
                                            <Th>Адреса</Th>
                                            <Th>Действия</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {customersList.data?.map((customer: Customer) =>
                                            (customer.deleted && <Tr key={customer.id}>
                                                <Td>{customer.lastName}</Td>
                                                <Td>{customer.firstName}</Td>
                                                <Td><Link to={`tel:${customer.phone}`}>{customer.phone}</Link></Td>
                                                <Td>
                                                    <UnorderedList>
                                                        {customer.addresses.map((address) =>
                                                            <ListItem
                                                                key={address.id}>г. {address.city.name}, {address.street}, {address.building}
                                                            </ListItem>)
                                                        }
                                                    </UnorderedList>
                                                </Td>
                                                <Td>
                                                    <ButtonGroup>
                                                        <StatefulButton
                                                            variant={"blue"}
                                                            title={"Восстановить"}
                                                            prefix={<MdRestoreFromTrash/>}
                                                            postfixWhenActive={"Восстановить?"}
                                                            clickHandler={async (_event) => {
                                                                await restoreCustomerMutation.mutate(customer.id)
                                                            }}/>
                                                    </ButtonGroup>
                                                </Td>

                                            </Tr>))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </>
                    }

                </div>
    )
}

export default Customers;