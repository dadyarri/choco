import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCheckMark, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {Link} from "react-router-dom";
import {HiEye, HiOutlineTrash, HiPencil} from "react-icons/hi2";
import $ from "jquery";

export class Orders extends Component {
    static displayName = Orders.name;

    constructor(props) {
        super(props);
        this.state = {shipments: [], loading: true};
    }

    async componentDidMount() {
        await this.populateOrdersData();
    }

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
                                    <button className={"btn btn-primary"} title={"Просмотреть детали"} type={"button"}><HiEye/>
                                    </button>
                                    <button className={"btn btn-success"} title={"Редактировать"} type={"button"}><HiPencil/>
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

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderOrdersTable(this.state.shipments);

        return (
            <div>
                <h1 id="tableLabel">Заказы</h1>
                <div className={"btn-group"}>
                    <button className={"btn btn-primary"} onClick={() => this.populateOrdersData()}>Обновить</button>
                    <Link className={"btn btn-success"} to={"/orders/new"}>Создать</Link>
                </div>
                {contents}
            </div>
        );
    }

    async populateOrdersData() {
        await axios.get("/api/orders")
            .then((response) =>
                this.setState({shipments: response.data, loading: false}))
    }
}
