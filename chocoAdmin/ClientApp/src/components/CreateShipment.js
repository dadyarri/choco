import React, {useEffect, useState} from 'react';
import {ErrorMessage, Field, FieldArray, Form, Formik} from 'formik';
import {Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';

export const CreateShipment = () => {
    const validationSchema = Yup.object().shape({
        date: Yup.date().required("Обязательно укажите дату поставки"),
        products: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать продукт обязательно!"),
                amount: Yup.number().required("Количество товара обязательно!").positive("Количество товара не может быть меньше единицы")
            })
        )
    })

    const getProductsList = async () => {
        await axios.get("/api/products")
            .then((response) =>
                setProducts(response.data)
            );
    }

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductsList();
    }, [])

    return (
        <div>
            <h1>Создание поставки</h1>
            <Formik
                initialValues={{date: '', products: []}}
                onSubmit={values => console.log(values)}
                validationSchema={validationSchema}
            >
                {({values}) => (
                    <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                        <div className={"form-group m-3"} key={"shipmentDateInputGroup"}>
                            <Label for={"dateInput"} key={"shipmentDateLabel"}>Дата поставки</Label>
                            <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"}
                                   key={"shipmentDateInput"}/>
                            <ErrorMessage name="date"/>
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"arrayOfProducts"} key={"arrayOfProductsLabel"}>Товары, входящие в
                                поставку</Label>
                            <FieldArray
                                name={"products"}
                                key={"arrayOfProducts"}
                                id={"arrayOfProducts"}
                                render={arrayHelpers => (
                                    <div className={"m-3"}>
                                        {values.products.map((product, index) => (
                                            <div className={"d-flex align-items-center m-3"}
                                                 key={`arrayOfProductsParentBlock_${index}`}>
                                                <div key={"arrayOfProductsInnerBlock"}>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsNameInputGroup_${index}`}>
                                                        <Label for={`productsName${index}Input`}
                                                               key={`arrayOfProductsNameLabel_${index}`}>Название
                                                            продукта</Label>
                                                        <Field name={`products[${index}].name`}
                                                               id={`productsName[${index}]Input`}
                                                               className={"form-control-sm"}
                                                               as={"select"}
                                                               key={`arrayOfProductsNameInput${index}`}
                                                        >
                                                            <option key={"arrayOfProductsDefaultOption"}
                                                                    defaultChecked>-- Выберите товар --
                                                            </option>
                                                            {products.map((product) => (
                                                                <option value={product.id}
                                                                        key={product.id}>{product.name}</option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name={`products[${index}].name`}/>

                                                    </div>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsAmountInputGroup_${index}`}>
                                                        <Label for={`productsAmount${index}Input`}
                                                               key={`arrayOfProductAmountLabel_${index}`}>Количество</Label>
                                                        <Field name={`products[${index}].amount`}
                                                               id={`productsAmount${index}Input`}
                                                               className={"form-control form-control-sm"}
                                                               type={"number"}
                                                               key={`arrayOfProductsAmountInput_${index}`}
                                                        />
                                                        <ErrorMessage name={`products[${index}].amount`}/>
                                                    </div>
                                                </div>
                                                <button type={"button"} onClick={() => arrayHelpers.remove(index)}
                                                        className={"btn btn-danger"} style={{maxHeight: 40}}
                                                        key={`arrayOfProductsRemoveButton_${index}`}
                                                >-
                                                </button>
                                            </div>
                                        ))}
                                        <button type={"button"}
                                                onClick={() => arrayHelpers.push({name: '', amount: ''})}
                                                className={"btn btn-primary"}
                                        >+ Добавить товар
                                        </button>
                                    </div>
                                )}
                            /></div>

                        <button type="submit" className={"btn btn-success"}>
                            Сохранить
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
