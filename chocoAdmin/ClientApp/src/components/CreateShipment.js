import React, {Component} from 'react';
import {Field, FieldArray, Form, Formik} from 'formik';
import {Label} from "reactstrap";
import axios from "axios";

export class CreateShipment extends Component {
    static displayName = CreateShipment.name;

    constructor(props) {
        super(props);
        this.state = {products: this.getProductsList()};
    }

    render() {
        return (
            <div>
                <h1>Создание поставки</h1>
                <Formik initialValues={{date: '', products: []}} onSubmit={values => console.log(values)}>
                    {({values}) => (
                        <Form style={{maxWidth: 400, margin: 20}} key={"productForm"}>
                            <div className={"form-group m-3"} key={"shipmentDateInputGroup"}>
                                <Label for={"dateInput"} key={"shipmentDateLabel"}>Дата поставки</Label>
                                <Field type={"date"} name={"date"} id={"dateInput"} className={"form-control"} key={"shipmentDateInput"}/>
                            </div>

                            <FieldArray
                                name={"products"}
                                key={"arrayOfProducts"}
                                render={arrayHelpers => (
                                    <div className={"m-3"}>
                                        {values.products.map((product, index) => (
                                            <div className={"d-flex align-items-center m-3"} key={`arrayOfProductsParentBlock_${index}`}>
                                                <div key={"arrayOfProductsInnerBlock"}>
                                                    <div className={"form-group m-3"} key={`arrayOfProductsNameInputGroup_${index}`}>
                                                        <Label for={`productsName${index}Input`} key={`arrayOfProductsNameLabel_${index}`}>Название продукта</Label>
                                                        <Field name={`products[${index}].name`}
                                                               id={`productsName[${index}]Input`}
                                                               className={"form-control-sm"}
                                                               as={"select"}
                                                               key={`arrayOfProductsNameInput${index}`}
                                                        >
                                                            {this.state.products.map((product) => (
                                                                <option value={product.id} key={product.id}>{product.name}</option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                    <div className={"form-group m-3"} key={`arrayOfProductsAmountInputGroup_${index}`}>
                                                        <Label for={`productsAmount${index}Input`} key={`arrayOfProductAmountLabel_${index}`}>Количество</Label>
                                                        <Field name={`products[${index}].amount`}
                                                               id={`productsAmount${index}Input`}
                                                               className={"form-control form-control-sm"}
                                                               type={"number"}
                                                               key={`arrayOfProductsAmountInput_${index}`}
                                                        />
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
    
    async getProductsList() {
        await axios.get("https://localhost:7157/products")
            .then((response) =>
                this.setState({products: response.data}
                )
            );
    }
}
