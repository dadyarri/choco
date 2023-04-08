import {Button, FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack} from "@chakra-ui/react";
import {AxiosError} from "axios";
import {Field, Form, Formik} from "formik";
import React, {useState} from "react";
import {BiArrowBack} from "react-icons/bi";
import {useQuery, useQueryClient} from "react-query";
import {Link, useNavigate, useParams} from "react-router-dom";
import {BeatLoader} from "react-spinners";
import * as Yup from "yup";

import {ProductCategory} from "entities/product-category";

import {LoadingButton} from "shared/ui/loading-button";

import {createProductCategory, getProductCategoryById, updateProductCategory} from "./index.utils";


const ProductCategoryEdit = () => {
    const {categoryId} = useParams();

    const {
        isLoading,
        isError,
        data,
        error
    } = useQuery<ProductCategory, AxiosError>(
        ["category", categoryId],
        () => getProductCategoryById(categoryId!),
        {enabled: categoryId !== undefined}
    );
    const queryClient = useQueryClient();

    const [isSubmitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Поле должно быть заполнено!")
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
                    <Heading as={"h1"} mb={4}>{data ? "Редактирование" : "Создание"} категории товара</Heading>
                    <Button as={Link}
                            colorScheme={"purple"}
                            to={"/categories"}
                            leftIcon={<BiArrowBack/>}
                            mb={4}
                    >Назад</Button>
                    <Formik
                        initialValues={{
                            name: data ? data.name : ""
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);
                            if (data) {
                                await updateProductCategory(data.id, values);
                                await queryClient.invalidateQueries(["category", categoryId]);
                            } else {
                                await createProductCategory(values);
                                navigate("/categories");
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

export default ProductCategoryEdit;