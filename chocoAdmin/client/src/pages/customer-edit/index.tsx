import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {AxiosError} from "axios";
import {Customer, Order, OrderCity, OrderStatus, Product} from "../../services/types";
import {createOrder, fetchOrderCitiesList, fetchOrderStatusesList, getCustomerById, updateOrder} from "./index.utils";
import React, {useState} from "react";
import * as Yup from "yup";
import {BeatLoader} from "react-spinners";
import {
    Button,
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
import {BiArrowBack, BiSave} from "react-icons/bi";
import {LoadingButton} from "../../components/loading-button";
import {HiOutlineTrash, HiPlus} from "react-icons/hi";
import {fetchProductsList} from "../orders/index.utils";
import {DateTime} from "luxon";

export const CustomerEdit = () => {

    const {customerId} = useParams();

    const customer = useQuery<Customer, AxiosError>(
        ["customer", customerId],
        () => getCustomerById(customerId!),
        {enabled: customerId !== undefined}
    );

    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        data: citiesData
    } = useQuery<OrderCity[], AxiosError>("orderCities", fetchOrderCitiesList);

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required("Поле обязательно"),
        lastName: Yup.string().required("Поле обязательно"),
        phone: Yup.string().test("phone", "Невалидный номер телефона", (value) => !!value && !/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/gi.test(value)),
        addresses: Yup.array().of(
            Yup.object().shape({
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
            }))
    })

    return (
        customer.isLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            customer.isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{customer.error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>{customer.data ? "Редактирование" : "Создание"} заказа</Heading>
                    <Button as={Link}
                            colorScheme={"purple"}
                            to={"/orders"}
                            leftIcon={<BiArrowBack/>}
                            mb={4}
                    >Назад</Button>
                    <Formik
                        initialValues={{
                            firstName: customer.data ? customer.data.firstName : '',
                            lastName: customer.data ? customer.data.lastName : '',
                            addresses: customer.data ? customer.data.addresses : [],
                            phone: customer.data ? customer.data.phone : '',
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);

                            if (customer) {
                                await updateCustomer(customer.data.id, values);
                                await queryClient.invalidateQueries(["customer", customerId]);
                            } else {
                                await createCustomer(values)
                                    .then((_) => navigate("/customers"))
                                    .catch((error) => console.error(error));
                            }
                            setSubmitting(false);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({values, errors, touched}) => (
                            <Form>
                                <VStack spacing={4} align={"flex-start"} mb={4}>
                                    <FormControl isInvalid={!!errors.date && touched.date}>
                                        <FormLabel>Дата заказа</FormLabel>
                                        <Field type={"date"} name={"date"} as={Input}/>
                                        <FormErrorMessage>{errors.date}</FormErrorMessage>
                                    </FormControl>
                                    {!order ?
                                        <FormControl>
                                            <Field type={"hidden"} name={"status"} value={undefined}/>
                                        </FormControl> :
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
                                        </FormControl>}

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