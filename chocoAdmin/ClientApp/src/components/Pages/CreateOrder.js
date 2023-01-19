import React, {useEffect, useState} from 'react';
import {Field, FieldArray, Form, Formik} from 'formik';
import {FormFeedback, Input, Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';
import {useNavigate} from "react-router-dom";
import {ToastsList} from "../Parts/Toasts/ToastsList";

export const CreateOrder = () => {

    const [products, setProducts] = useState([]);
    const [orderStatuses, setOrderStatuses] = useState([]);
    const [cities, setCities] = useState([]);
    const [toasts, setToasts] = useState([]);
    const navigate = useNavigate();
    const getProductsList = async () => {
        await axios.get("/api/products")
            .then((response) =>
                setProducts(response.data)
            );
    }

    const getOrderStatusesList = async () => {
        await axios.get("/api/orderStatuses")
            .then((response) =>
                setOrderStatuses(response.data)
            );
    }

    const getCitiesList = async () => {
        await axios.get("/api/orderCities")
            .then((response) =>
                setCities(response.data)
            );
    }

    const createOrder = (values) => {
        axios.post("/api/orders", values)
            .then((_) => navigate("/orders"))
            .catch((error) => {
                console.log("tock");
                if (error.response && error.response.status === 409) {
                    setToasts([...toasts, {
                        id: toasts.length + 1,
                        heading: "Ошибка создания заказа",
                        body: "Недостаточно товара",
                        color: "danger"
                    }])
                }
            })
    }

    const validationSchema = Yup.object().shape({
        date: Yup.date().required("Обязательно укажите дату заказа"),
        status: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать статус заказа обязательно!"),
        orderItems: Yup.array().of(
            Yup.object().shape({
                id: Yup.string().uuid("Неверный формат идентификатора!").required("Выбрать продукт обязательно!"),
                amount: Yup.number().required("Количество товара обязательно!").positive("Количество товара не может быть меньше или равно нулю")
            })
        ),
        address: Yup.object().shape({
            city: Yup.string().uuid("Неверный формат идентификатора").required("Выбрать город обязательно"),
            street: Yup.string().required("Обязательное поле!").test(
                "no-short-names",
                "Не стоит использовать сокращения топонимов, это снижает точность поиска маршрута",
                (value) => !/^(ул|прт|пр-т|пр|прд|пр-д)\.? .*/gi.test(value)
            ),
            building: Yup.string().required("Обязательное поле!")
        })
    })

    useEffect(() => {
        getProductsList();
        getCitiesList();
        getOrderStatusesList();
    }, []);


    return (
        <div>
            <ToastsList toastList={toasts}/>
            <h1>Создание заказа</h1>
            <Formik
                initialValues={{
                    date: '',
                    status: '',
                    orderItems: [],
                    address: {city: '', street: '', building: ''}
                }}
                onSubmit={values => {
                    createOrder(values)
                }}
                validationSchema={validationSchema}
            >
                {({values, errors, touched}) => (
                    <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                        <div className={"form-group m-3"} key={"orderDateInputGroup"}>
                            <Label for={"dateInput"} key={"orderDateLabel"}>Дата заказа</Label>
                            <Field type={"date"} name={"date"} id={"dateInput"}
                                   key={"orderDateInput"} as={Input} invalid={errors.date && touched.date}
                                   valid={!errors.date && touched.date}/>
                            {errors.date && touched.date ?
                                <FormFeedback>{errors.date}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"ordersState"}>Статус заказа</Label>
                            <Field name={`status`}
                                   id={`orderState`}
                                   as={Input}
                                   type={"select"}
                                   key={`orderStateInput`}
                                   valid={!errors.status && touched.status}
                                   invalid={errors.status && touched.status}
                            >
                                <option key={"orderStateDefaultOption"}
                                        defaultChecked>-- Выберите статус заказа --
                                </option>
                                {orderStatuses.map((os) => (
                                    <option value={os.id}
                                            key={os.id}>{os.name}</option>
                                ))}
                            </Field>
                            {errors.status && touched.status ?
                                <FormFeedback>{errors.status}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"arrayOfProducts"} key={"arrayOfProductsLabel"}>Товары, входящие в
                                заказ</Label>
                            <FieldArray
                                name={"orderItems"}
                                key={"arrayOfProducts"}
                                id={"arrayOfProducts"}
                                render={arrayHelpers => (
                                    <div className={"m-3"}>
                                        {values.orderItems.map((product, index) => (
                                            <div className={"d-flex align-items-center m-3"}
                                                 key={`arrayOfProductsParentBlock_${index}`}>
                                                <div key={"arrayOfProductsInnerBlock"}>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsNameInputGroup_${index}`}>
                                                        <Label for={`productsName${index}Input`}
                                                               key={`arrayOfProductsNameLabel_${index}`}>Название
                                                            продукта</Label>
                                                        <Field name={`orderItems[${index}].id`}
                                                               id={`productsName[${index}]Input`}
                                                               className={"form-select-sm"}
                                                               as={Input}
                                                               type={"select"}
                                                               key={`arrayOfProductsNameInput${index}`}
                                                               valid={errors &&
                                                                   errors.orderItems &&
                                                                   errors.orderItems[index] &&
                                                                   !errors.orderItems[index].id &&
                                                                   touched && touched.orderItems &&
                                                                   touched.orderItems[index] &&
                                                                   touched.orderItems[index].id}
                                                               invalid={errors &&
                                                                   errors.orderItems &&
                                                                   errors.orderItems[index] &&
                                                                   errors.orderItems[index].id &&
                                                                   touched && touched.orderItems &&
                                                                   touched.orderItems[index] &&
                                                                   touched.orderItems[index].id}
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
                                                        errors.orderItems &&
                                                        errors.orderItems[index] &&
                                                        errors.orderItems[index].id &&
                                                        touched && touched.orderItems &&
                                                        touched.orderItems[index] &&
                                                        touched.orderItems[index].id ?
                                                            <FormFeedback>{errors.orderItems[index].id}</FormFeedback> : null}

                                                    </div>
                                                    <div className={"form-group m-3"}
                                                         key={`arrayOfProductsAmountInputGroup_${index}`}>
                                                        <Label for={`productsAmount${index}Input`}
                                                               key={`arrayOfProductAmountLabel_${index}`}>Количество</Label>
                                                        <Field name={`orderItems[${index}].amount`}
                                                               id={`productsAmount${index}Input`}
                                                               as={Input}
                                                               className={"form-control-sm"}
                                                               type={"number"}
                                                               key={`arrayOfProductsAmountInput_${index}`}
                                                               valid={errors &&
                                                                   errors.orderItems &&
                                                                   errors.orderItems[index] &&
                                                                   !errors.orderItems[index].amount &&
                                                                   touched && touched.orderItems &&
                                                                   touched.orderItems[index] &&
                                                                   touched.orderItems[index].amount}
                                                               invalid={errors &&
                                                                   errors.orderItems &&
                                                                   errors.orderItems[index] &&
                                                                   errors.orderItems[index].amount &&
                                                                   touched && touched.orderItems &&
                                                                   touched.orderItems[index] &&
                                                                   touched.orderItems[index].amount}
                                                        />
                                                        {errors &&
                                                        errors.orderItems &&
                                                        errors.orderItems[index] &&
                                                        errors.orderItems[index].amount &&
                                                        touched && touched.orderItems &&
                                                        touched.orderItems[index] &&
                                                        touched.orderItems[index].amount ?
                                                            <FormFeedback>{errors.orderItems[index].amount}</FormFeedback> : null}
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
                        <div className={"form-group m-3"}>
                            <Label for={"city"}>Город</Label>
                            <Field name={`address.city`}
                                   id={"city"}
                                   className={"form-select"}
                                   as={Input}
                                   type={"select"}
                                   valid={!errors.address?.city && touched.address?.city}
                                   invalid={errors.address?.city && touched.address?.city}
                            >
                                <option defaultChecked>-- Выберите город --
                                </option>
                                {cities.map((city) => (
                                    <option value={city.id}
                                            key={city.id}>{city.name}</option>
                                ))}
                            </Field>
                            {errors.address?.city && touched.address?.city ?
                                <FormFeedback>{errors.address?.city}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"street"}>Улица</Label>
                            <Field id={"street"} name={"address.street"} as={Input}
                                   valid={!errors.address?.street && touched.address?.street}
                                   invalid={errors.address?.street && touched.address?.street}/>
                            {errors.address?.street && touched.address?.street ?
                                <FormFeedback>{errors.address.street}</FormFeedback> : null}
                        </div>
                        <div className={"form-group m-3"}>
                            <Label for={"building"}>Дом/Строение</Label>
                            <Field id={"building"} name={"address.building"} className={"form-control"} as={Input}
                                   valid={!errors.address?.building && touched.address?.building}
                                   invalid={errors.address?.building && touched.address?.building}/>
                            {errors.address?.building && touched.address?.building ?
                                <FormFeedback>{errors.address.building}</FormFeedback> : null}
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
