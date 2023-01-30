import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {Product, ProductCategory} from "../../services/types";
import {AxiosError} from "axios";
import {createProduct, getProductById, getProductCategories, updateProduct} from "./product-edit.utils";
import {BeatLoader} from "react-spinners";
import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {LoadingButton} from "../../components/loading-button/loading-button";
import {
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel, Heading,
    Input,
    InputGroup,
    InputRightAddon,
    Select
} from "@chakra-ui/react";


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
    )
    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const {
        isLoading: _isCategoriesLoading,
        isError: _isCategoriesErrored,
        data: categoriesData,
        error: _categoriesError
    } = useQuery<ProductCategory[], AxiosError>("productCategory", getProductCategories);

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
                    <Heading as={"h1"}>{data ? "Редактирование" : "Создание"} товара</Heading>
                    <Formik
                        initialValues={{
                            name: data ? data.name : '',
                            wholesalePrice: data ? data.wholesalePrice : '',
                            retailPrice: data ? data.retailPrice : '',
                            category: data ? data.category.id : '',
                            marketId: data ? data.marketId : '',
                            isByWeight: data ? data.isByWeight : false
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);
                            if (data) {
                                await updateProduct(data.id, values);
                                await queryClient.invalidateQueries(["product", productId])
                            } else {
                                await createProduct(values);
                                navigate("/warehouse");
                            }
                            setSubmitting(false)
                        }}
                        validationSchema={validationSchema}
                    >
                        {({errors, touched}) => (
                            <Form>
                                <FormControl className={"m-2"}>
                                    <FormLabel>Название</FormLabel>
                                    <Field type={"text"} name={"name"} as={Input}/>
                                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                                </FormControl>
                                <FormControl className={"m-2"}>
                                    <FormLabel>Оптовая цена</FormLabel>
                                    <InputGroup>
                                        <Field as={Input} type={"number"}
                                               name={"wholesalePrice"}/>
                                        <InputRightAddon>&#8381;</InputRightAddon>
                                        <FormErrorMessage>{errors.wholesalePrice}</FormErrorMessage>
                                    </InputGroup>
                                </FormControl>
                                <FormControl className={"m-2"}>
                                    <FormLabel>Розничная цена</FormLabel>
                                    <InputGroup>
                                        <Field as={Input} type={"number"}
                                               name={"retailPrice"}/>
                                        <InputRightAddon>&#8381;</InputRightAddon>
                                        <FormErrorMessage>{errors.retailPrice}</FormErrorMessage>
                                    </InputGroup>

                                </FormControl>
                                <FormControl className={"m-2"}>
                                    <FormLabel>Категория</FormLabel>
                                    <Field as={Select}
                                           name={"category"}
                                    >
                                        {categoriesData && categoriesData.map((pc) => (
                                            <option key={pc.id} value={pc.id}>{pc.name}</option>
                                        ))}
                                    </Field>
                                    <FormErrorMessage>{errors.category}</FormErrorMessage>
                                </FormControl>

                                <FormControl className={"m-2"}>
                                    <FormLabel>ИД товара в ВК</FormLabel>
                                    <Field name={"marketId"} id={"marketIdInput"} as={Input}/>
                                    <FormErrorMessage>{errors.marketId}</FormErrorMessage>
                                </FormControl>

                                <FormControl className={"m-2"}>
                                    <Field type={"checkbox"} name={"isByWeight"}
                                           as={Checkbox}
                                    >
                                        На развес?
                                    </Field>
                                    <FormErrorMessage>{errors.isByWeight}</FormErrorMessage>
                                </FormControl>
                                <LoadingButton
                                    variant={"success"}
                                    label={"Сохранить"}
                                    title={"Сохранить"}
                                    type={"submit"}
                                    isSubmitting={isSubmitting}
                                />
                            </Form>
                        )}
                    </Formik>
                </div>
    )
}

export default ProductEdit;