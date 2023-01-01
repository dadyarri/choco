import React, {Component} from 'react';
import {ErrorMessage, Field, Form, Formik} from 'formik';
import {Label} from "reactstrap";
import axios from "axios";
import * as Yup from 'yup';

export class CreateProduct extends Component {
    static displayName = CreateProduct.name;
    validationSchema = Yup.object().shape({})

    constructor(props) {
        super(props);
        this.state = {categories: []};
    }

    async componentDidMount() {
        await this.getCategoriesList()
    }

    render() {
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
                        leftover: 0
                    }}
                    onSubmit={values => console.log(values)}
                    validationSchema={this.validationSchema}
                >
                    {({values, errors, touched}) => (
                        <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                            <div className={"form-group m-3"}>
                                <Label for={"nameInput"}>Название товара</Label>
                                <Field name={"name"} id={"nameInput"} className={"form-control"}/>
                                <ErrorMessage name="name"/>
                            </div>
                            <div className={"form-group m-3"}>
                                <Label for={"category"} key={"arrayOfProductsLabel"}>Категория товара</Label>
                                <Field as={"select"} id={"category"} className={"form-select"} name={"category"}>
                                    <option defaultChecked>-- Выберите категорию товара --
                                    </option>
                                    {this.state.categories.map((category) => (
                                        <option value={category.id}
                                                key={category.id}>{category.name}</option>
                                    ))}
                                </Field>
                            </div>
                            <div className="form-group m-3">

                                <Label for={"retailPrice"}>Розничная цена</Label>
                                <div className={"input-group"}>
                                    <Field type={"number"} className={"form-control"} id={"retailPrice"}
                                           name={"retailPrice"}/>
                                    <span className="input-group-text">&#8381;</span>
                                </div>
                            </div>
                            <div className="form-group m-3">
                                <Label for={"wholesalePrice"}>Оптовая цена</Label>
                                <div className="input-group">
                                    <Field className={"form-control"} type={"number"} id={"wholesalePrice"} name={"wholesalePrice"}/>
                                    <span className="input-group-text">&#8381;</span>
                                </div>
                            </div>

                            <div className="form-check m-3">
                                <Field type={"checkbox"} name={"isByWeight"} id={"isByWeight"}
                                       className={"form-check-input"}/>
                                <Label for={"isByWeight"} className={"form-check-label"}>На развес?</Label>
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

    async getCategoriesList() {
        await axios.get("https://localhost:7157/productCategories")
            .then((response) =>
                this.setState({categories: response.data}
                )
            );
    }
}
