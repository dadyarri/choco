import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import {GiCheckMark, GiWeight} from "react-icons/gi";
import axios from "axios";
import {Link} from "react-router-dom";
import {ImWarning} from "react-icons/im";
import {
    Button,
    ButtonGroup,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupText,
    Label,
    Modal,
    ModalBody,
    ModalHeader, Toast, ToastBody, ToastHeader
} from "reactstrap";
import {HiOutlineTrash, HiPencil} from "react-icons/hi2";
import $ from "jquery";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";

export class Warehouse extends Component {
    static displayName = Warehouse.name;
    productSchema = {
        name: '',
        retailPrice: 0,
        wholesalePrice: 0,
        isByWeight: false,
        leftover: 0,
        category: {
            id: '',
            name: ''
        }
    };

    validationSchema = Yup.object().shape({
        name: Yup.string().required("Поле должно быть заполнено!"),
        category: Yup.string().uuid("Неверный формат идентификатора").required("Поле должно быть заполнено!"),
        retailPrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        wholesalePrice: Yup.number().required("Поле должно быть заполнено").min(1, "Цена не должна быть меньше 1"),
        isByWeight: Yup.bool(),
        leftover: Yup.number()
    });

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            editModalData: this.productSchema,
            productCategories: [],
            updateToastOpened: false
        };
    }

    componentDidMount() {
        this.populateProductsData();
    }

    async deleteConfirm(itemId) {
        let button = $(`.btn.btn-danger[data-item-id="${itemId}"]`);
        let clickCount = parseInt(button.attr("data-clicked"));

        clickCount += 1
        button.attr("data-clicked", clickCount);

        if (clickCount === 1) {
            button.attr("aria-pressed", true);
            setTimeout(() => {
                button.attr("aria-pressed", false);
                button.attr("data-clicked", 0);
            }, 3000)
        } else if (clickCount === 2) {
            await axios.delete(`/api/products/${itemId}`)
            await this.populateProductsData();
        }
    }

    async openEditModal(itemId) {
        await axios.get(`/api/products/${itemId}`).then(response => {
            this.setState({isEditModalOpened: true, editModalData: response.data});
        });
        await axios.get("/api/productCategories").then(response => {
            this.setState({productCategories: response.data})
        })
    }

    closeEditModal = () => {
        this.setState({
            isEditModalOpened: false,
            editModalData: this.productSchema
        });
    };

    renderProductsTable(products) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product =>
                    <tr key={uuid()} className={product.leftover < 0 ?
                        "table-danger" : ""}>
                        <td>{product.name} {product.isByWeight ? <GiWeight/> : null}</td>
                        <td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</td>
                        <td>{product.leftover} {product.isByWeight ? 'кг.' : 'шт.'} {product.leftover < 0 ?
                            <ImWarning/> : null}</td>
                        <td>
                            <ButtonGroup>
                                <Button
                                    type={"button"}
                                    color={"primary"}
                                    title={"Редактировать"}
                                    onClick={() => this.openEditModal(product.id)}>
                                    <HiPencil/>
                                </Button>
                                <Button
                                    color={"danger"}
                                    type={"button"}
                                    title={"Удалить"}
                                    data-item-id={product.id}
                                    data-bs-toggle={"button"}
                                    data-clicked={0}
                                    aria-pressed={false}
                                    onClick={() => this.deleteConfirm(product.id)}
                                >
                                    <HiOutlineTrash/>
                                </Button>
                            </ButtonGroup>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    exportImage = async () => {
        await axios.get("/api/Export").then(() => {
            this.setState({updateToastOpened: true})
        })
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderProductsTable(this.state.products);

        const editData = this.state.editModalData;

        return (
            <>
                <Modal isOpen={this.state.isEditModalOpened}>
                    <ModalHeader toggle={this.closeEditModal}>Редактирование товара</ModalHeader>
                    <ModalBody>
                        <Formik
                            initialValues={{
                                name: editData.name,
                                wholesalePrice: editData.wholesalePrice,
                                retailPrice: editData.retailPrice,
                                category: editData.category.id
                            }}
                            onSubmit={async (values) => {
                                values.productId = editData.id;
                                await axios.put(`/api/products`, values);
                                this.closeEditModal();
                                await this.populateProductsData();
                            }}
                            validationSchema={this.validationSchema}
                        >
                            {({values, errors, touched}) => (
                                <Form>
                                    <FormGroup>
                                        <Label>Название</Label>
                                        <Field type={"text"} name={"name"} as={Input}
                                               valid={!errors.name && touched.name}
                                               invalid={errors.name && touched.name}/>
                                        {errors.name && touched.name ?
                                            <FormFeedback>{errors.name}</FormFeedback> : null}
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Оптовая цена</Label>
                                        <InputGroup>
                                            <Field as={Input} type={"number"}
                                                   name={"wholesalePrice"}
                                                   valid={!errors.wholesalePrice && touched.wholesalePrice}
                                                   invalid={errors.wholesalePrice && touched.wholesalePrice}/>
                                            <InputGroupText>&#8381;</InputGroupText>
                                            {errors.wholesalePrice && touched.wholesalePrice ?
                                                <FormFeedback>{errors.wholesalePrice}</FormFeedback> : null}
                                        </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Розничная цена</Label>
                                        <InputGroup>
                                            <Field as={Input} type={"number"}
                                                   name={"retailPrice"}
                                                   valid={!errors.retailPrice && touched.retailPrice}
                                                   invalid={errors.retailPrice && touched.retailPrice}/>
                                            <InputGroupText>&#8381;</InputGroupText>
                                            {errors.retailPrice && touched.retailPrice ?
                                                <FormFeedback>{errors.retailPrice}</FormFeedback> : null}
                                        </InputGroup>

                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Категория</Label>
                                        <Field as={Input} type={"select"} name={"category"}
                                               valid={!errors.category && touched.category}
                                               invalid={errors.category && touched.category}>
                                            {this.state.productCategories.map((pc) => (
                                                <option key={pc.id} value={pc.id}>{pc.name}</option>
                                            ))}
                                        </Field>
                                        {errors.category && touched.category ?
                                            <FormFeedback>{errors.category}</FormFeedback> : null}
                                    </FormGroup>
                                    <FormGroup check>
                                        <Field type={"checkbox"} name={"isByWeight"}
                                               as={Input}
                                               valid={!errors.isByWeight && touched.isByWeight}
                                               invalid={errors.isByWeight && touched.isByWeight}
                                        />
                                        <Label for={"isByWeight"} check>На
                                            развес?</Label>
                                        {errors.isByWeight && touched.isByWeight ?
                                            <FormFeedback>{errors.isByWeight}</FormFeedback> : null}
                                    </FormGroup>
                                    <Button color={"success"} type={"submit"} className={"mt-3"}>Сохранить</Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <div>
                    <h1 id="tableLabel">Склад</h1>
                    <div className={"btn-group"}>
                        <button className={"btn btn-primary"} onClick={() => this.populateProductsData()}>Обновить
                        </button>
                        <Link className={"btn btn-success"} to={"/warehouse/new"}>Создать</Link>
                        <Button color={"info"} onClick={this.exportImage}>Экспорт в ВК</Button>
                    </div>
                    {contents}
                </div>
                <Toast isOpen={this.state.updateToastOpened} style={{position: "fixed", bottom: 20, right: 20}}>
                    <ToastHeader icon={<GiCheckMark/>} toggle={() => {this.setState({updateToastOpened: false})}}>
                        Обновление поста
                    </ToastHeader>
                    <ToastBody>
                        Пост успешно обновлён!
                    </ToastBody>
                </Toast>
            </>
        );
    }

    async populateProductsData() {
        await axios.get("/api/products")
            .then((response) =>
                this.setState({products: response.data, loading: false}
                )
            );
    }
}
