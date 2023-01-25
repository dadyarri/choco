import React, {useEffect, useState} from 'react';
import {Field, Form, Formik} from 'formik';
import {FormFeedback, Input, Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";

export const CreateProduct = () => {
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Поле должно быть заполнено!"),
        category: Yup.string().uuid("Неверный формат идентификатора").required("Поле должно быть заполнено!"),
        retailPrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        wholesalePrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        isByWeight: Yup.bool(),
        leftover: Yup.number(),
        marketId: Yup.number()
    });
    const [categories, setCategories] = useState([])
    const navigate = useNavigate();

    const getCategoriesList = async () => {
        await axios.get("/api/productCategories")
            .then((response) =>
                setCategories(response.data)
            );
    }

    useEffect(() => {
        getCategoriesList();
    }, [])

    return (
        <div>
            <h1>Создание товара</h1>
            <Formik
                initialValues={{
                    name: '',
                    category: '',
                    retailPrice: '',
                    wholesalePrice: '',
                    isByWeight: false,
                    leftover: 0,
                    marketId: 0
                }}
                onSubmit={async values => {
                    await axios.post("/api/products", values);
                    navigate("/warehouse");
                }}
                validationSchema={validationSchema}
            >
                {({values, errors, touched}) => (
                    <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                        <div className={"form-group m-3"}>
                            <Label for={"nameInput"}>Название товара</Label>
                            <Field name={"name"} id={"nameInput"} as={Input} valid={!errors.name && touched.name}
                                   invalid={errors.name && touched.name}/>
                            {errors.name && touched.name ? <FormFeedback>{errors.name}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"category"} key={"arrayOfProductsLabel"}>Категория товара</Label>
                            <Field as={Input} id={"category"} type={"select"} name={"category"}
                                   valid={!errors.category && touched.category}
                                   invalid={errors.category && touched.category}>
                                <option defaultChecked>-- Выберите категорию товара --
                                </option>
                                {categories.map((category) => (
                                    <option value={category.id}
                                            key={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            {errors.category && touched.category ?
                                <FormFeedback>{errors.category}</FormFeedback> : null}

                        </div>
                        <div className="form-group m-3">

                            <Label for={"retailPrice"}>Розничная цена</Label>
                            <div className={"input-group"}>
                                <Field type={"number"} as={Input} id={"retailPrice"}
                                       name={"retailPrice"} valid={!errors.retailPrice && touched.retailPrice}
                                       invalid={errors.retailPrice && touched.retailPrice}/>
                                <span className="input-group-text">&#8381;</span>
                                {errors.retailPrice && touched.retailPrice ?
                                    <FormFeedback>{errors.retailPrice}</FormFeedback> : null}
                            </div>
                        </div>
                        <div className="form-group m-3">
                            <Label for={"wholesalePrice"}>Оптовая цена</Label>
                            <div className="input-group">
                                <Field as={Input} type={"number"} id={"wholesalePrice"}
                                       name={"wholesalePrice"} valid={!errors.wholesalePrice && touched.wholesalePrice}
                                       invalid={errors.wholesalePrice && touched.wholesalePrice}/>
                                <span className="input-group-text">&#8381;</span>
                                {errors.wholesalePrice && touched.wholesalePrice ?
                                    <FormFeedback>{errors.wholesalePrice}</FormFeedback> : null}
                            </div>
                        </div>

                        <div className={"form-group m-3"}>
                            <Label for={"nameInput"}>ИД товара в ВК</Label>
                            <Field name={"marketId"} id={"marketIdInput"} as={Input}
                                   valid={!errors.marketId && touched.marketId}
                                   invalid={errors.marketId && touched.marketId}/>
                            {errors.marketId && touched.marketId ?
                                <FormFeedback>{errors.marketId}</FormFeedback> : null}
                        </div>

                        <div className="form-check m-3">
                            <Field type={"checkbox"} name={"isByWeight"} id={"isByWeight"}
                                   className={"form-check-input"}
                                   valid={!errors.isByWeight && touched.isByWeight}
                                   invalid={errors.isByWeight && touched.isByWeight}
                                   as={Input}
                            />
                            <Label for={"isByWeight"} className={"form-check-label"}>На развес?</Label>
                            {errors.isByWeight && touched.isByWeight ?
                                <FormFeedback>{errors.isByWeight}</FormFeedback> : null}
                        </div>

                        <Field type={"hidden"} name={"leftover"} value={0}/>

                        <button type="submit" className={"btn btn-success"}>
                            Сохранить
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
