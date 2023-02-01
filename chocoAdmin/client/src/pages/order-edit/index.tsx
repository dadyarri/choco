import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {Order, OrderCity, OrderStatus, Product} from "../../services/types";
import {createOrder, fetchOrderCitiesList, fetchOrderStatusesList, getOrderById, updateOrder} from "./index.utils";
import React, {useState} from "react";
import * as Yup from "yup";
import {BeatLoader} from "react-spinners";
import {
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    IconButton,
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
import {Field, FieldArray, Form, Formik} from "formik";
import {BiSave} from "react-icons/bi";
import {LoadingButton} from "../../components/loading-button";
import {HiOutlineTrash, HiPlus} from "react-icons/hi";
import {fetchProductsList} from "../orders/index.utils";

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

    const {
        data: products
    } = useQuery(
        "products",
        fetchProductsList,
    )

    const orderItems = []

    if (order) {
        for (let i = 0; i < order.orderItems.length; i++) {
            orderItems.push({id: order.orderItems[i].product.id, amount: order.orderItems[i].amount})
        }
    }

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
                            orderItems: order ? orderItems : [],
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
                        {({values, errors, touched}) => (
                            <Form>
                                <VStack spacing={4} align={"flex-start"} mb={4}>
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
                                    <FormControl isInvalid={!!errors.address?.street && touched.address?.street}
                                                 isRequired>
                                        <FormLabel>Улица</FormLabel>
                                        <Field as={Input} name={"address.street"}/>
                                        <FormErrorMessage>{errors.address?.street}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.address?.building && touched.address?.building}
                                                 isRequired>
                                        <FormLabel>Дом</FormLabel>
                                        <Field as={Input} name={"address.building"}/>
                                        <FormErrorMessage>{errors.address?.building}</FormErrorMessage>
                                    </FormControl>
                                    <FieldArray name={"orderItems"}>
                                        {(arrayHelpers) => (
                                            <FormControl>
                                                <FormLabel>Содержимое заказа</FormLabel>
                                                <TableContainer>
                                                    <Flex direction={"row-reverse"}>
                                                        <IconButton
                                                            icon={<HiPlus/>}
                                                            colorScheme={"green"} mb={4}
                                                            onClick={() => {
                                                                arrayHelpers.push({
                                                                    id: '',
                                                                    amount: ''
                                                                })
                                                            }}
                                                            aria-label={"create"}>

                                                        </IconButton>
                                                    </Flex>
                                                    {values.orderItems.length > 0 && <Table variant={"striped"}>
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Товар</Th>
                                                                <Th>Количество</Th>
                                                                <Th>Действия</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {values.orderItems.map((item, index) =>
                                                                <Tr key={index}>
                                                                    <Td>
                                                                        <FormControl>
                                                                            <Field
                                                                                name={`orderItems[${index}].id`}
                                                                                type={"select"}
                                                                                as={Select}
                                                                            >
                                                                                <option defaultChecked>
                                                                                    -- Выберите товар --
                                                                                </option>
                                                                                {products && products.map((product: Product) =>
                                                                                    <option
                                                                                        key={product.id}
                                                                                        value={product.id}
                                                                                    >
                                                                                        {product.name}
                                                                                    </option>)}
                                                                            </Field>
                                                                        </FormControl>
                                                                    </Td>
                                                                    <Td>
                                                                        <FormControl>
                                                                            <Field name={`orderItems[${index}].amount`}
                                                                                   type={"number"}
                                                                                   step={0.1}
                                                                                   as={Input}
                                                                            />
                                                                        </FormControl>
                                                                    </Td>
                                                                    <Td>
                                                                        <IconButton
                                                                            colorScheme={"red"}
                                                                            title={"Удалить"}
                                                                            icon={<HiOutlineTrash/>}
                                                                            onClick={() => {
                                                                                arrayHelpers.remove(index)
                                                                            }}
                                                                            aria-label={"delete"}/>
                                                                    </Td>
                                                                </Tr>
                                                            )}
                                                        </Tbody>
                                                    </Table>}
                                                </TableContainer>
                                            </FormControl>
                                        )}
                                    </FieldArray>
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