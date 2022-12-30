import React, {Component} from 'react';
import {Formik, Form, Field, ErrorMessage, FieldArray} from 'formik';
import {Label} from "reactstrap";
import {v4 as uuid} from 'uuid';

export class CreateShipment extends Component {
    static displayName = CreateShipment.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Создание поставки</h1>
                <Formik initialValues={{date: '', products: []}} onSubmit={values => console.log(values)}>
                    {({values}) => (
                        <Form style={{maxWidth: 400, margin: 20}}>
                            <div className={"form-group m-3"}>
                                <Label for={"dateInput"}>Дата поставки</Label>
                                <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"}/>
                            </div>

                            <FieldArray
                                name={"products"}
                                render={arrayHelpers => (
                                    <div className={"m-3"}>
                                        {values.products.map((product, index) => (
                                            <div className={"d-flex align-items-center m-3"}>
                                                <div>
                                                    <div className={"form-group m-3"}>
                                                        <Label for={`productsName${index}Input`}>Название продукта</Label>
                                                        <Field name={`products[${index}].name`}
                                                               id={`productsName[${index}]Input`}
                                                               className={"form-control"}/>
                                                    </div>
                                                    <div className={"form-group m-3"}>
                                                        <Label for={`productsAmount${index}Input`}>Количество</Label>
                                                        <Field name={`products[${index}].amount`}
                                                               id={`productsAmount${index}Input`}
                                                               className={"form-control"}
                                                               type={"number"}
                                                        />
                                                    </div>
                                                </div>
                                                <button type={"button"} onClick={() => arrayHelpers.remove(index)}
                                                        className={"btn btn-danger"} style={{maxHeight: 40}}
                                                        key={uuid()}
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
                            />

                            <button type="submit" className={"btn btn-success"}>
                                Сохранить
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}
