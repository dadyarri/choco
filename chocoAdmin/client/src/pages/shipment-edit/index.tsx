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
import {AxiosError} from "axios";
import {Product, Shipment, ShipmentStatus} from "entities";
import {Field, FieldArray, Form, Formik} from "formik";
import {DateTime} from "luxon";
import React, {useState} from "react";
import {BiArrowBack, BiSave} from "react-icons/bi";
import {HiOutlineTrash, HiPlus} from "react-icons/hi";
import {useQuery, useQueryClient} from "react-query";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BeatLoader} from "react-spinners";
import * as Yup from "yup";

import {LoadingButton} from "shared/ui/loading-button";


import {createShipment, fetchProductsList, fetchShipmentStatusesList, getShipmentById, updateShipment} from "./index.utils";

export const ShipmentEdit = () => {

    const {shipmentId} = useParams();

    const {
        isLoading: isShipmentLoading,
        isError: isShipmentErrored,
        data: shipment,
        error: shipmentError
    } = useQuery<Shipment, AxiosError>(
        ["shipment", shipmentId],
        () => getShipmentById(shipmentId!),
        {enabled: shipmentId !== undefined}
    );

    const {
        data: products
    } = useQuery(
        "products",
        fetchProductsList,
    );

    const shipmentItems = [];

    if (shipment) {
        for (let i = 0; i < shipment.shipmentItems.length; i++) {
            shipmentItems.push({id: shipment.shipmentItems[i].product.id, amount: shipment.shipmentItems[i].amount});
        }
    }

    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        data: statusesData
    } = useQuery<ShipmentStatus[], AxiosError>("shipmentStatuses", fetchShipmentStatusesList);

    const validationSchema = Yup.object().shape({
        date: Yup.date(),
        shipmentItems: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать продукт обязательно!"),
                amount: Yup.number().required("Количество товара обязательно!").positive("Количество товара не может быть меньше или равно нулю")
            })
        )
    });

    return (
        isShipmentLoading ?
            <BeatLoader color={"#36d7b7"}/> :
            isShipmentErrored ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{shipmentError?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>{shipment ? "Редактирование" : "Создание"} поставки</Heading>
                    <Button as={Link}
                            colorScheme={"purple"}
                            to={"/shipments"}
                            leftIcon={<BiArrowBack/>}
                            mb={4}
                    >Назад</Button>
                    <Formik
                        initialValues={{
                            date: shipment ? shipment.date : "",
                            shipmentItems: shipment ? shipmentItems : [],
                            status: shipment ? shipment.status.id : undefined,
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);

                            if (!values.date) {
                                values.date = DateTime.now().toFormat("yyyy-MM-dd");
                            }

                            if (shipment) {
                                await updateShipment(shipment.id, values);
                                await queryClient.invalidateQueries(["shipment", shipmentId]);
                            } else {
                                await createShipment(values)
                                    .then((_) => navigate("/shipments"))
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
                                        <FormLabel>Дата поставки</FormLabel>
                                        <Field type={"date"} name={"date"} as={Input}/>
                                        <FormErrorMessage>{errors.date}</FormErrorMessage>
                                    </FormControl>
                                    {!shipment ?
                                        <FormControl>
                                            <Field type={"hidden"} name={"status"}/>
                                        </FormControl> :
                                        <FormControl isInvalid={!!errors.status && touched.status} isRequired>
                                            <FormLabel>Статус поставки</FormLabel>
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
                                    <FieldArray name={"shipmentItems"}>
                                        {(arrayHelpers) => (
                                            <FormControl>
                                                <FormLabel>Содержимое поставки</FormLabel>
                                                <TableContainer>
                                                    <Flex direction={"row-reverse"}>
                                                        <IconButton
                                                            icon={<HiPlus/>}
                                                            colorScheme={"green"} mb={4}
                                                            onClick={() => {
                                                                arrayHelpers.push({
                                                                    id: "",
                                                                    amount: ""
                                                                });
                                                            }}
                                                            aria-label={"create"}>

                                                        </IconButton>
                                                    </Flex>
                                                    {values.shipmentItems.length > 0 && <Table variant={"striped"}>
                                                        <Thead>
                                                            <Tr>
                                                                <Th>Товар</Th>
                                                                <Th>Количество</Th>
                                                                <Th>Действия</Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {values.shipmentItems.map((item, index) =>
                                                                <Tr key={index}>
                                                                    <Td>
                                                                        <FormControl>
                                                                            <Field
                                                                                name={`shipmentItems[${index}].id`}
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
                                                                            <Field
                                                                                name={`shipmentItems[${index}].amount`}
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
                                                                                arrayHelpers.remove(index);
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
    );
};
