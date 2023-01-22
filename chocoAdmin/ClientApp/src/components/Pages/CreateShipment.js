import React, {useEffect, useState} from 'react';
import {Field, FieldArray, Form, Formik} from 'formik';
import {FormFeedback, Input, Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";

export const CreateShipment = () => {
    const validationSchema = Yup.object().shape({
        date: Yup.date().required("Обязательно укажите дату поставки"),
        items: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать продукт обязательно!"),
                amount: Yup.number().required("Количество товара обязательно!").positive("Количество товара не может быть меньше единицы")
            })
        ),
        status: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать статус обязательно!")
    })

    const getProductsList = async () => {
        await axios.get("/api/products")
            .then((response) =>
                setProducts(response.data)
            );
    }
    const getShipmentStatusesList = async () => {
        await axios.get("/api/shipmentStatuses")
            .then((response) =>
                setShipmentStatuses(response.data)
            );
    }

    const [products, setProducts] = useState([]);
    const [shipmentStatuses, setShipmentStatuses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getProductsList();
        getShipmentStatusesList();
    }, [])

    return (
        <div>
            <h1>Создание поставки</h1>
            <Formik
                initialValues={{date: '', shipmentItems: [], status: ''}}
                onSubmit={async values => {
                    await axios.post("/api/shipments", values)
                        .then((_) => navigate("/shipments"))
                }}
                validationSchema={validationSchema}
            >
                {({values, errors, touched}) => (
                    <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                        <div className={"form-group m-3"} key={"shipmentDateInputGroup"}>
                            <Label for={"dateInput"} key={"shipmentDateLabel"}>Дата поставки</Label>
                            <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"}
                                   key={"shipmentDateInput"} as={Input} invalid={errors.date && touched.date}
                                   valid={!errors.date && touched.date}/>
                            {errors.date && touched.date ?
                                <FormFeedback>{errors.date}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"arrayOfProducts"} key={"arrayOfProductsLabel"}>Товары, входящие в
                                поставку</Label>
                            <FieldArray
                                name={"shipmentItems"}
                                key={"arrayOfProducts"}
                                id={"arrayOfProducts"}
                                render={arrayHelpers => (
                                    <div className={"m-3"}>
                                        {values.shipmentItems.map((product, index) => (
                                            <div className={"d-flex align-items-center m-3"}
                                                 key={`arrayOfProductsParentBlock_${index}`}>
                                                <div key={"arrayOfProductsInnerBlock"}>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsNameInputGroup_${index}`}>
                                                        <Label for={`productsName${index}Input`}
                                                               key={`arrayOfProductsNameLabel_${index}`}>Название
                                                            продукта</Label>
                                                        <Field name={`shipmentItems[${index}].id`}
                                                               id={`productsName[${index}]Input`}
                                                               className={"form-control-sm"}
                                                               as={Input}
                                                               type={"select"}
                                                               valid={errors &&
                                                                   errors.shipmentItems &&
                                                                   errors.items[index] &&
                                                                   !errors.items[index].id &&
                                                                   touched && touched.shipmentItems &&
                                                                   touched.items[index] &&
                                                                   touched.items[index].id}
                                                               invalid={errors &&
                                                                   errors.shipmentItems &&
                                                                   errors.items[index] &&
                                                                   errors.items[index].id &&
                                                                   touched && touched.shipmentItems &&
                                                                   touched.items[index] &&
                                                                   touched.items[index].id}
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
                                                        {errors &&
                                                        errors.shipmentItems &&
                                                        errors.items[index] &&
                                                        errors.items[index].id &&
                                                        touched && touched.shipmentItems &&
                                                        touched.items[index] &&
                                                        touched.items[index].id ?
                                                            <FormFeedback>{errors.items[index].id}</FormFeedback> : null}

                                                    </div>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsAmountInputGroup_${index}`}>
                                                        <Label for={`productsAmount${index}Input`}
                                                               key={`arrayOfProductAmountLabel_${index}`}>Количество</Label>
                                                        <Field name={`shipmentItems[${index}].amount`}
                                                               id={`productsAmount${index}Input`}
                                                               className={"form-control-sm"}
                                                               type={"number"}
                                                               as={Input}
                                                               valid={errors &&
                                                                   errors.shipmentItems &&
                                                                   errors.items[index] &&
                                                                   !errors.items[index].amount &&
                                                                   touched && touched.shipmentItems &&
                                                                   touched.items[index] &&
                                                                   touched.items[index].amount}
                                                               invalid={errors &&
                                                                   errors.shipmentItems &&
                                                                   errors.items[index] &&
                                                                   errors.items[index].amount &&
                                                                   touched && touched.shipmentItems &&
                                                                   touched.items[index] &&
                                                                   touched.items[index].amount}
                                                               key={`arrayOfProductsAmountInput_${index}`}
                                                        />
                                                        {errors &&
                                                        errors.shipmentItems &&
                                                        errors.items[index] &&
                                                        errors.items[index].amount &&
                                                        touched && touched.shipmentItems &&
                                                        touched.items[index] &&
                                                        touched.items[index].amount ?
                                                            <FormFeedback>{errors.items[index].amount}</FormFeedback> : null}
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
                                                onClick={() => arrayHelpers.push({id: '', amount: ''})}
                                                className={"btn btn-primary"}
                                        >+ Добавить товар
                                        </button>
                                    </div>
                                )}
                            /></div>

                        <div className="form-group m-3">
                            <Label for={"statusInput"}>Статус поставки</Label>
                            <Field type={"select"}
                                   name={"status"}
                                   as={Input}
                                   invalid={errors.status && touched.status}
                                   valid={!errors.status && touched.status}>
                                <option defaultChecked>-- Выберите статус --
                                </option>
                                {shipmentStatuses.map((product) => (
                                    <option value={product.id}
                                            key={product.id}>{product.name}</option>
                                ))}
                            </Field>
                            {errors.status && touched.status ?
                                <FormFeedback>{errors.status}</FormFeedback> : null}
                        </div>

                        <button type="submit" className={"btn btn-success"}>
                            Сохранить
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
