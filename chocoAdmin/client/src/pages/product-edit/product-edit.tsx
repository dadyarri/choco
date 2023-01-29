import {useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "react-query";
import {Product, ProductCategory} from "../../services/types";
import {AxiosError} from "axios";
import {createProduct, getProductById, getProductCategories, updateProduct} from "./product-edit.utils";
import {BeatLoader} from "react-spinners";
import React, {useState} from "react";
import {InputGroup} from "react-bootstrap";
import {Field, Form, Formik} from "formik";
import BsForm from "react-bootstrap/Form";
import * as Yup from "yup";
import {LoadingButton} from "../../components/loading-button/loading-button";


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
                    <h1>Ошибка загрузки</h1>
                    <p>{error?.message}</p>
                </div> :
                <div>
                    <h1>{data ? "Редактирование" : "Создание"} товара</h1>
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
                                <BsForm.Group className={"m-2"}>
                                    <BsForm.Label>Название</BsForm.Label>
                                    <Field type={"text"} name={"name"} as={BsForm.Control}
                                           valid={!errors.name && touched.name}
                                           invalid={errors.name && touched.name}/>
                                    {errors.name && touched.name ?
                                        <BsForm.Control.Feedback>{errors.name}</BsForm.Control.Feedback> : null}
                                </BsForm.Group>
                                <BsForm.Group className={"m-2"}>
                                    <BsForm.Label>Оптовая цена</BsForm.Label>
                                    <InputGroup>
                                        <Field as={BsForm.Control} type={"number"}
                                               name={"wholesalePrice"}
                                               valid={!errors.wholesalePrice && touched.wholesalePrice}
                                               invalid={errors.wholesalePrice && touched.wholesalePrice}/>
                                        <InputGroup.Text>&#8381;</InputGroup.Text>
                                        {errors.wholesalePrice && touched.wholesalePrice ?
                                            <BsForm.Control.Feedback>{errors.wholesalePrice}</BsForm.Control.Feedback> : null}
                                    </InputGroup>
                                </BsForm.Group>
                                <BsForm.Group className={"m-2"}>
                                    <BsForm.Label>Розничная цена</BsForm.Label>
                                    <InputGroup>
                                        <Field as={BsForm.Control} type={"number"}
                                               name={"retailPrice"}
                                               valid={!errors.retailPrice && touched.retailPrice}
                                               invalid={errors.retailPrice && touched.retailPrice}/>
                                        <InputGroup.Text>&#8381;</InputGroup.Text>
                                        {errors.retailPrice && touched.retailPrice ?
                                            <BsForm.Control.Feedback>{errors.retailPrice}</BsForm.Control.Feedback> : null}
                                    </InputGroup>

                                </BsForm.Group>
                                <BsForm.Group className={"m-2"}>
                                    <BsForm.Label>Категория</BsForm.Label>
                                    <Field as={BsForm.Select}
                                           name={"category"}
                                           valid={!errors.category && touched.category}
                                           invalid={errors.category && touched.category}
                                    >
                                        {categoriesData && categoriesData.map((pc) => (
                                            <option key={pc.id} value={pc.id}>{pc.name}</option>
                                        ))}
                                    </Field>
                                    {errors.category && touched.category ?
                                        <BsForm.Control.Feedback>{errors.category}</BsForm.Control.Feedback> : null}
                                </BsForm.Group>

                                <BsForm.Group className={"m-2"}>
                                    <BsForm.Label>ИД товара в ВК</BsForm.Label>
                                    <Field name={"marketId"} id={"marketIdInput"} as={BsForm.Control}
                                           valid={!errors.marketId && touched.marketId}
                                           invalid={errors.marketId && touched.marketId}/>
                                    {errors.marketId && touched.marketId ?
                                        <BsForm.Control.Feedback>{errors.marketId}</BsForm.Control.Feedback> : null}
                                </BsForm.Group>

                                <BsForm.Group className={"m-2"}>
                                    <Field type={"checkbox"} name={"isByWeight"}
                                           as={BsForm.Check}
                                           valid={!errors.isByWeight && touched.isByWeight}
                                           invalid={errors.isByWeight && touched.isByWeight}
                                           className={"mr-2"}
                                           label={"На развес?"}
                                    />
                                    {errors.isByWeight && touched.isByWeight ?
                                        <BsForm.Control.Feedback>{errors.isByWeight}</BsForm.Control.Feedback> : null}
                                </BsForm.Group>
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