import React, {Component} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

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
                            <Field type={"date"} name={"date"} className={"form-control"}/>
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
