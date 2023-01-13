import React, {Component} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {FormFeedback, Input, Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';

export class CreateCategory extends Component {
    static displayName = CreateCategory.name;
    validationSchema = Yup.object().shape({
        name: Yup.string().required("Поле обязательно!")
    })

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>Создание категории</h1>
                <Formik
                    initialValues={{
                        name: '',
                    }}
                    onSubmit={values => console.log(values)}
                    validationSchema={this.validationSchema}
                >
                    {({values, errors, touched}) => (
                        <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                            <div className={"form-group m-3"}>
                                <Label for={"nameInput"}>Название категории</Label>
                                <Field name={"name"} id={"nameInput"} className={"form-control"} as={Input}
                                       valid={!errors.name && touched.name}
                                       invalid={errors.name && touched.name}
                                />
                                {errors.name && touched.name ? <FormFeedback>{errors.name}</FormFeedback> : null}
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
}
