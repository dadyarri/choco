import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {Link} from "react-router-dom";
import {HiOutlineTrash, HiPencil} from "react-icons/hi2";
import $ from "jquery";
import {Button, FormGroup, Input, Label, List, Modal, ModalBody, ModalHeader} from "reactstrap";
import {Field, Form, Formik} from "formik";

export class Orders extends Component {
    static displayName = Orders.name;

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            loading: true,
            isEditModalOpened: false,
            editModalData: this.orderSchema,
            orderStatuses: []
        };
    }

    async componentDidMount() {
        await this.populateOrdersData();
        await this.populateOrdersStatuesesData();
    }

    orderSchema = {date: '', address: {city: {name: ''}, building: '', street: ''}, status: {id: ''}};

    getOrderStatusIcon(status) {
        switch (status) {
            case "Выполнен": {
                return <GiCheckMark/>
            }
            case "Доставляется": {
                return <TbTruckDelivery/>
            }
            case "Обрабатывается": {
                return <GiSandsOfTime/>
            }
            case "Отменён": {
                return <GiCancel/>
            }
            default: {
                return null
            }
        }
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
            await axios.delete(`/api/orders/${itemId}`)
            await this.populateOrdersData();
        }
    }

    async openEditModal(itemId) {
        await axios.get(`/api/orders/${itemId}`).then(response => {
            this.setState({isEditModalOpened: true, editModalData: response.data});
        });
    }

    renderOrdersTable(orders) {
        return (
            <div className={"table-responsive-md"}>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Содержимое заказа</th>
                        <th>Адрес</th>
                        <th>Итог</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order =>
                        (!order.deleted && <tr key={uuid()}>
                            <td>{new Date(order.date).toLocaleDateString("ru-RU")} {this.getOrderStatusIcon(order.status.name)}</td>
                            <td>
                                <ul>
                                    {order.orderItems.map(item =>
                                        <li key={uuid()}>{item.product.name} x{item.amount}</li>
                                    )}
                                </ul>
                            </td>
                            <td>г.&nbsp;{order.address.city.name}, {order.address.street}, {order.address.building}</td>
                            <td>
                                {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)}&nbsp;&#8381;
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button className={"btn btn-primary"} title={"Редактировать"} type={"button"}
                                            onClick={() => this.openEditModal(order.id)}
                                    >
                                        <HiPencil/>
                                    </button>
                                    <button className={"btn btn-danger"} title={"Удалить"} data-bs-toggle="button"
                                            data-item-id={order.id}
                                            data-clicked={0}
                                            aria-pressed={"false"}
                                            type={"button"}
                                            onClick={() => this.deleteConfirm(order.id)}><HiOutlineTrash/>
                                    </button>
                                </div>
                            </td>
                        </tr>)
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    closeEditModal = () => {
        this.setState({
            isEditModalOpened: false,
            editModalData: this.orderSchema
        });
    };

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderOrdersTable(this.state.orders);

        const editData = this.state.editModalData;

        return (
            <>
                <Modal isOpen={this.state.isEditModalOpened}>
                    <ModalHeader toggle={this.closeEditModal}>Редактирование заказа</ModalHeader>
                    <ModalBody>
                        <Formik initialValues={{
                            date: editData.date,
                            orderItems: editData.orderItems,
                            status: editData.status.id
                        }}
                                onSubmit={async (values) => {
                                    values.orderId = editData.id;
                                    await axios.put(`/api/orders`, values);
                                    this.closeEditModal();
                                    await this.populateOrdersData();
                                    
                                }}>
                            {({values}) => (
                                <Form>
                                    <FormGroup>
                                        <Label>Дата заказа</Label>
                                        <Field as={Input} disabled name={"date"}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Содержимое заказа</Label>
                                        <List>
                                            {values.orderItems.map((item) => (
                                                <li key={item.id}>{item.product.name} x{item.amount}</li>
                                            ))}
                                        </List>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Статус заказа</Label>
                                        <Field as={Input} type={"select"} name={"status"}>
                                            {this.state.orderStatuses.map((os) => (
                                                <option key={os.id} value={os.id}>{os.name}</option>
                                            ))}
                                        </Field>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Адрес</Label>
                                        <Field as={Input} disabled name={"address"}
                                               value={`г. ${editData.address.city.name}, ${editData.address.street}, ${editData.address.building}`}/>
                                    </FormGroup>
                                    <Button color={"success"} type={"submit"}>Сохранить</Button>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>
                <div>
                    <h1 id="tableLabel">Заказы</h1>
                    <div className={"btn-group"}>
                        <button className={"btn btn-primary"} onClick={() => this.populateOrdersData()}>Обновить
                        </button>
                        <Link className={"btn btn-success"} to={"/orders/new"}>Создать</Link>
                    </div>
                    {contents}
                </div>
            </>
        );
    }

    async populateOrdersData() {
        await axios.get("/api/orders")
            .then((response) =>
                this.setState({orders: response.data, loading: false}));
    }

    async populateOrdersStatuesesData() {
        await axios.get("/api/orderStatuses")
            .then((response) =>
                this.setState({orderStatuses: response.data})
            );
    }
}
