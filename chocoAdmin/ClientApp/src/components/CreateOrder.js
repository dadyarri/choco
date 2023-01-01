import React, {Component} from 'react';
import {Field, FieldArray, Form, Formik, ErrorMessage} from 'formik';
import {Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';

export class CreateOrder extends Component {
    static displayName = CreateOrder.name;
    validationSchema = Yup.object().shape({
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
            street: Yup.string(),
            building: Yup.string()
        })
    })

    constructor(props) {
        super(props);
        this.state = {products: [], orderStatuses: [], cities: []};
    }

    async componentDidMount() {
        await this.getOrderStatusesList()
        await this.getProductsList()
        await this.getCitiesList()
    }
    
    async createOrder(values) {
        
    }

    render() {
        return (
            <div>
                <h1>Создание заказа</h1>
                <Formik
                    initialValues={{date: '', status: '', orderItems: [], address: {city: '', street: '', building: ''}}}
                    onSubmit={async values => {
                        console.log(values)
                        await this.createOrder(values)
                    }}
                    validationSchema={this.validationSchema}
                >
                    {({values, errors, touched}) => (
                        <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                            <div className={"form-group m-3"} key={"shipmentDateInputGroup"}>
                                <Label for={"dateInput"} key={"shipmentDateLabel"}>Дата заказа</Label>
                                <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"}
                                       key={"shipmentDateInput"}/>
                                <ErrorMessage name="date"/>
                            </div>
                            <div className={"form-group m-3"}>
                                <Label for={"ordersState"}>Статус заказа</Label>
                                <Field name={`status`}
                                       id={`orderState`}
                                       className={"form-select"}
                                       as={"select"}
                                       key={`orderStateInput`}
                                >
                                    <option key={"orderStateDefaultOption"}
                                            defaultChecked>-- Выберите статус заказа --
                                    </option>
                                    {this.state.orderStatuses.map((os) => (
                                        <option value={os.id}
                                                key={os.id}>{os.name}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name={"status"}/>
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
                                                                   as={"select"}
                                                                   key={`arrayOfProductsNameInput${index}`}
                                                            >
                                                                <option key={"arrayOfProductsDefaultOption"}
                                                                        defaultChecked>-- Выберите товар --
                                                                </option>
                                                                {this.state.products.map((product) => (
                                                                    <option value={product.id}
                                                                            key={product.id}>{product.name}</option>
                                                                ))}
                                                            </Field>
                                                            <ErrorMessage name={`orderItems[${index}].name`}/>

                                                        </div>
                                                        <div className={"form-group m-3"}
                                                             key={`arrayOfProductsAmountInputGroup_${index}`}>
                                                            <Label for={`productsAmount${index}Input`}
                                                                   key={`arrayOfProductAmountLabel_${index}`}>Количество</Label>
                                                            <Field name={`orderItems[${index}].amount`}
                                                                   id={`productsAmount${index}Input`}
                                                                   className={"form-control form-control-sm"}
                                                                   type={"number"}
                                                                   key={`arrayOfProductsAmountInput_${index}`}
                                                            />
                                                            <ErrorMessage name={`orderItems[${index}].amount`}/>
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
                                       as={"select"}
                                >
                                    <option defaultChecked>-- Выберите город --
                                    </option>
                                    {this.state.cities.map((city) => (
                                        <option value={city.id}
                                                key={city.id}>{city.name}</option>
                                    ))}
                                </Field>
                            </div>
                            <div className={"form-group m-3"}>
                                <Label for={"street"}>Улица</Label>
                                <Field id={"street"} name={"address.street"} className={"form-control"}/>
                            </div>
                            <div className={"form-group m-3"}>
                                <Label for={"building"}>Дом/Строение</Label>
                                <Field id={"building"} name={"address.building"} className={"form-control"}/>
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

    async getProductsList() {
        await axios.get("https://localhost:7157/products")
            .then((response) =>
                this.setState({products: response.data}
                )
            );
    }

    async getOrderStatusesList() {
        await axios.get("https://localhost:7157/orderStatuses")
            .then((response) =>
                this.setState({orderStatuses: response.data}
                )
            );
    }

    async getCitiesList() {
        await axios.get("https://localhost:7157/orderCities")
            .then((response) =>
                this.setState({cities: response.data}
                )
            );
    }
}
