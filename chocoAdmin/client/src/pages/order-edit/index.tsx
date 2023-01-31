import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {Order, OrderCity, OrderStatus} from "../../services/types";
import {createOrder, fetchOrderCitiesList, fetchOrderStatusesList, getOrderById, updateOrder} from "./index.utils";
import React, {useState} from "react";
import * as Yup from "yup";
import {BeatLoader} from "react-spinners";
import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack
} from "@chakra-ui/react";
import {Field, Form, Formik} from "formik";
import {BiSave} from "react-icons/bi";
import {LoadingButton} from "../../components/loading-button";

export const OrderEdit = () => {

    const {orderId} = useParams();

    const {
        isLoading: isOrderLoading,
        isError: isOrderErrored,
        data: order,
        error: orderError
    } = useQuery<Order, AxiosError>(
        ["order", orderId],
        () => getOrderById(orderId!),
        {enabled: orderId !== undefined}
    );

    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        data: statusesData
    } = useQuery<OrderStatus[], AxiosError>("orderStatuses", fetchOrderStatusesList);

    const {
        data: citiesData
    } = useQuery<OrderCity[], AxiosError>("orderCities", fetchOrderCitiesList);

    const validationSchema = Yup.object().shape({
        date: Yup.date().required("Обязательно укажите дату заказа"),
        status: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать статус заказа обязательно!"),
        orderItems: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать продукт обязательно!"),
                amount: Yup.number().required("Количество товара обязательно!").positive("Количество товара не может быть меньше или равно нулю")
            })
        ),
        address: Yup.object().shape({
            city: Yup.string().uuid("Неверный формат идентификатора").required("Выбрать город обязательно"),
            street: Yup.string().required("Обязательное поле!").test(
                "no-short-names",
                "Не стоит использовать сокращения топонимов, это снижает точность поиска маршрута",
                (value) => !!value && !/^(ул|прт|пр-т|пр|прд|пр-д)\.? .*/gi.test(value)
            ).test(
                "long-name-must-be",
                "Должно быть указано полное название топонима (улица, проспект, переулок и пр.)",
                (value) => !!value && /^(улица|проспект|переулок)\.? .*/gi.test(value)
            ),
            building: Yup.string().required("Обязательное поле!")
        })
    })

    return (
        isOrderLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            isOrderErrored ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{orderError?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>{order ? "Редактирование" : "Создание"} заказа</Heading>
                    <Formik
                        initialValues={{
                            date: order ? order.date : '',
                            orderItems: order ? order.orderItems : [],
                            status: order ? order.status.id : '',
                            address: {
                                city: order ? order.address.city.id : '',
                                street: order ? order.address.street : '',
                                building: order ? order.address.building : '',
                            }
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);
                            if (order) {
                                await updateOrder(order.id, values);
                                await queryClient.invalidateQueries(["order", orderId]);
                            } else {
                                await createOrder(values).then(
                                    (_) => navigate("/orders")
                                );
                            }
                            setSubmitting(false);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <VStack spacing={4} align={"flex-start"}>
                                    <FormControl isInvalid={!!errors.date && touched.date} isRequired>
                                        <FormLabel>Дата заказа</FormLabel>
                                        <Field type={"date"} name={"date"} as={Input}/>
                                        <FormErrorMessage>{errors.date}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.status && touched.status} isRequired>
                                        <FormLabel>Статус заказа</FormLabel>
                                        <Field as={Select} name={"status"}>
                                            <option defaultChecked>--Выберите статус --</option>
                                            {statusesData?.map((status) =>
                                                <option key={status.id}
                                                        value={status.id}
                                                >
                                                    {status.name}
                                                </option>
                                            )}
                                        </Field>
                                        <FormErrorMessage>{errors.status}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.address?.city && touched.address?.city} isRequired>
                                        <FormLabel>Город</FormLabel>
                                        <Field as={Select} name={"address.city"}>
                                            <option defaultChecked>-- Выберите город --</option>
                                            {citiesData?.map((city) =>
                                                <option key={city.id}
                                                        value={city.id}
                                                >
                                                    {city.name}
                                                </option>
                                            )}
                                        </Field>
                                        <FormErrorMessage>{errors.address?.city}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.address?.street && touched.address?.street} isRequired>
                                        <FormLabel>Улица</FormLabel>
                                        <Field as={Input} name={"address.street"}/>
                                        <FormErrorMessage>{errors.address?.street}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.address?.building && touched.address?.building} isRequired>
                                        <FormLabel>Дом</FormLabel>
                                        <Field as={Input} name={"address.building"}/>
                                        <FormErrorMessage>{errors.address?.building}</FormErrorMessage>
                                    </FormControl>
                                    {order ?
                                        <FormControl>
                                            <FormLabel>Содержимое заказа</FormLabel>
                                            <TableContainer>
                                                <Table>
                                                    <Thead>
                                                        <Tr>
                                                            <Th>Товар</Th>
                                                            <Th>Количество</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {order.orderItems.map((item) =>
                                                            <Tr key={item.id}>
                                                                <Td>{item.product.name}</Td>
                                                                <Td>{item.amount}</Td>
                                                            </Tr>)}
                                                    </Tbody>
                                                </Table>
                                            </TableContainer>
                                        </FormControl>
                                        : null}
                                    <LoadingButton
                                        variant={"green"}
                                        leftIcon={<BiSave/>}
                                        label={"Сохранить"}
                                        title={"Сохранить"}
                                        type={"submit"}
                                        isSubmitting={isSubmitting}
                                    />
                                </VStack>
                            </Form>
                        )}

                    </Formik>
                </div>
    )
}