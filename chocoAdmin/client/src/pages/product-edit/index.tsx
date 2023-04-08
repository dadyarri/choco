import {
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    VStack
} from "@chakra-ui/react";
import {AxiosError} from "axios";
import {Field, Form, Formik} from "formik";
import React, {useState} from "react";
import {BiArrowBack} from "react-icons/bi";
import {useQuery, useQueryClient} from "react-query";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BeatLoader} from "react-spinners";
import * as Yup from "yup";

import {Product} from "entities/product";
import {ProductCategory} from "entities/product-category";
import {LoadingButton} from "shared/ui/loading-button";

import {createProduct, getProductById, getProductCategories, updateProduct} from "./index.utils";


const ProductEdit = () => {
    const {productId} = useParams();

    const {
        isLoading,
        isError,
        data,
        error
    } = useQuery<Product, AxiosError>(
        ["product", productId],
        () => getProductById(productId!),
        {enabled: productId !== undefined}
    );
    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const categories = useQuery<ProductCategory[], AxiosError>("productCategory", getProductCategories);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Поле должно быть заполнено!"),
        category: Yup.string().uuid("Неверный формат идентификатора").required("Поле должно быть заполнено!"),
        retailPrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        wholesalePrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        isByWeight: Yup.bool(),
        leftover: Yup.number(),
        marketId: Yup.number()
    });

    return (
        isLoading ?
            <BeatLoader color="#36d7b7"/> :
            isError ?
                <div>
                    <Heading as={"h1"}>Ошибка загрузки</Heading>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <Heading as={"h1"} mb={4}>{data ? "Редактирование" : "Создание"} товара</Heading>
                    <Button as={Link}
                            colorScheme={"purple"}
                            to={"/warehouse"}
                            leftIcon={<BiArrowBack/>}
                            mb={4}
                    >Назад</Button>
                    <Formik
                        initialValues={{
                            name: data ? data.name : "",
                            wholesalePrice: data ? data.wholesalePrice : "",
                            retailPrice: data ? data.retailPrice : "",
                            category: data ? data.category.id : "",
                            marketId: data ? data.marketId : "",
                            isByWeight: data ? data.isByWeight : false
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);
                            if (data) {
                                await updateProduct(data.id, values);
                                await queryClient.invalidateQueries(["product", productId]);
                            } else {
                                await createProduct(values);
                                navigate("/warehouse");
                            }
                            setSubmitting(false);
                        }}
                        validationSchema={validationSchema}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <VStack spacing={4} align={"flex-start"}>
                                    <FormControl
                                        isInvalid={!!errors.name && touched.name}>
                                        <FormLabel>Название</FormLabel>
                                        <Field type={"text"} name={"name"} as={Input}/>
                                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.wholesalePrice && touched.wholesalePrice}>
                                        <FormLabel>Оптовая цена</FormLabel>
                                        <InputGroup>
                                            <Field as={Input} type={"number"}
                                                   name={"wholesalePrice"}/>
                                            <InputRightAddon>&#8381;</InputRightAddon>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.wholesalePrice}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.retailPrice && touched.retailPrice}>
                                        <FormLabel>Розничная цена</FormLabel>
                                        <InputGroup>
                                            <Field as={Input} type={"number"}
                                                   name={"retailPrice"}/>
                                            <InputRightAddon>&#8381;</InputRightAddon>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.retailPrice}</FormErrorMessage>

                                    </FormControl>
                                    <FormControl isInvalid={!!errors.category && touched.category}>
                                        <FormLabel>Категория</FormLabel>
                                        <Field as={Select}
                                               name={"category"}
                                        >
                                            <option defaultChecked>-- Выберите категорию --</option>
                                            {categories.data && categories.data.map((pc) => (
                                                (!pc.deleted && <option key={pc.id} value={pc.id}>{pc.name}</option>)
                                            ))}
                                        </Field>
                                        <FormErrorMessage>{errors.category}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.marketId && touched.marketId}>
                                        <FormLabel>ИД товара в ВК</FormLabel>
                                        <Field name={"marketId"} id={"marketIdInput"} as={Input}/>
                                        <FormErrorMessage>{errors.marketId}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.isByWeight && touched.marketId}>
                                        <Field type={"checkbox"} name={"isByWeight"}
                                               as={Checkbox}
                                        >
                                            На развес?
                                        </Field>
                                        <FormErrorMessage>{errors.isByWeight}</FormErrorMessage>
                                    </FormControl>
                                    <LoadingButton
                                        variant={"green"}
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

export default ProductEdit;