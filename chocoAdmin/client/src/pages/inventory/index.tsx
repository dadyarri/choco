import {
    FormControl,
    FormLabel,
    Heading,
    Input,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { BiSave } from "react-icons/bi";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import { Product } from "entities/product";
import { LoadingButton } from "shared/ui/loading-button";

import { fetchProductsList, sendInventory } from "./index.utils";

export const Inventory = () => {
    const products = useQuery<Product[], AxiosError>("products", fetchProductsList);

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    return products.isLoading ? (
        <BeatLoader color={"#36d7b7"} />
    ) : products.isError ? (
        <div>
            <Heading as={"h1"}>Ошибка загрузки</Heading>
            <p>{products.error?.message}</p>
        </div>
    ) : (
        <div>
            <Heading as={"h1"} mb={4}>
                Ревизия
            </Heading>
            <Formik
                initialValues={{
                    products: products.data,
                }}
                onSubmit={async (values) => {
                    setSubmitting(true);

                    await sendInventory(values)
                        .then((_) => navigate("/warehouse"))
                        .catch((error) => console.error(error));
                    setSubmitting(false);
                }}
            >
                {({ values }) => (
                    <Form>
                        <VStack spacing={4} align={"flex-start"} mb={4}>
                            <FieldArray name={"products"}>
                                {() => (
                                    <FormControl>
                                        <FormLabel>Товары</FormLabel>
                                        <TableContainer>
                                            {products.data && products.data?.length > 0 && (
                                                <Table variant={"striped"}>
                                                    <Thead>
                                                        <Tr>
                                                            <Th>Товар</Th>
                                                            <Th>Количество</Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {values.products?.map((item, index) => (
                                                            <Tr key={index}>
                                                                <Td>
                                                                    <FormControl>
                                                                        <Field
                                                                            name={`products[${index}].id`}
                                                                            type={"text"}
                                                                            as={Input}
                                                                            disabled
                                                                            value={item.name}
                                                                            style={{ opacity: 1 }}
                                                                        />
                                                                    </FormControl>
                                                                </Td>
                                                                <Td>
                                                                    <FormControl>
                                                                        <Field
                                                                            name={`products[${index}].leftover`}
                                                                            type={"number"}
                                                                            step={0.1}
                                                                            as={Input}
                                                                        />
                                                                    </FormControl>
                                                                </Td>
                                                            </Tr>
                                                        ))}
                                                    </Tbody>
                                                </Table>
                                            )}
                                        </TableContainer>
                                    </FormControl>
                                )}
                            </FieldArray>
                            <LoadingButton
                                variant={"green"}
                                leftIcon={<BiSave />}
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
