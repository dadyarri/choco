import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {ProductCategory} from "../../services/types";
import {AxiosError} from "axios";
import {createProductCategory, getProductCategoryById, updateProductCategory} from "./index.utils";
import {BeatLoader} from "react-spinners";
import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {LoadingButton} from "../../components/loading-button";
import {FormControl, FormErrorMessage, FormLabel, Heading, Input, VStack} from "@chakra-ui/react";


const ProductCategoryEdit = () => {
    const {categoryId} = useParams();

    const {
        isLoading,
        isError,
        data,
        error
    } = useQuery<ProductCategory, AxiosError>(
        ["product", categoryId],
        () => getProductCategoryById(categoryId!),
        {enabled: categoryId !== undefined}
    )
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
                    <Heading as={"h1"} mb={4}>{data ? "Редактирование" : "Создание"} товара</Heading>
                    <Formik
                        initialValues={{
                            name: data ? data.name : ''
                        }}
                        onSubmit={async (values) => {
                            setSubmitting(true);
                            if (data) {
                                await updateProductCategory(data.id, values);
                                await queryClient.invalidateQueries(["product", categoryId])
                            } else {
                                await createProductCategory(values);
                                navigate("/categories");
                            }
                            setSubmitting(false)
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
    )
}

export default ProductCategoryEdit;