import React, {Component} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {Label} from "reactstrap";

export class CreateShipment extends Component {
    static displayName = CreateShipment.name;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Создание поставки</h1>
                <Formik initialValues={{date: ''}} onSubmit={values => console.log(values)}>
                    <Form style={{maxWidth: 400, margin: 20}}>
                        <div className={"form-group m-3"}>
                            <Label for={"dateInput"}>Дата поставки</Label>
                            <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"}/>
                        </div>
                        <button type="submit" className={"btn btn-success"}>
                            Сохранить
                        </button>
                    </Form>
                </Formik>
            </div>
        );
    }
}
