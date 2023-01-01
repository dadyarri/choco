import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiClockwork, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {HiDocumentMagnifyingGlass} from "react-icons/hi2";
import {Link} from "react-router-dom";

export class Orders extends Component {
    static displayName = Orders.name;

    constructor(props) {
        super(props);
        this.state = {shipments: [], loading: true};
    }

    componentDidMount() {
        this.populateOrdersData();
    }

    static getShipmentItemStatusIcon(status) {
        switch (status) {
            case "Получено": {
                return <GiCheckMark/>
            }
            case "Ожидается": {
                return <GiClockwork/>
            }
            case "Отменено": {
                return <GiCancel/>
            }
            default: {
                return null
            }
        }
    }

    static getOrderStatusIcon(status) {
        switch (status) {
            case "Получено": {
                return <GiCheckMark/>
            }
            case "Доставляется": {
                return <TbTruckDelivery/>
            }
            case "Ожидается": {
                return <GiSandsOfTime/>
            }
            case "В работе": {
                return <HiDocumentMagnifyingGlass/>
            }
            default: {
                return null
            }
        }
    }

    static renderOrdersTable(orders) {
        return (
            <div className={"table-responsive-md"}>
                <table className="table table-striped" aria-labelledby="tableLabel">
                    <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Содержимое заказа</th>
                        <th>Итог</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order =>
                        <tr key={uuid()}>
                            <td>{order.date} {this.getOrderStatusIcon(order.status.name)}</td>
                            <td>
                                <ul>
                                    {order.orderItems.map(item =>
                                        <li key={uuid()}>{item.product.name} x{item.amount}</li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                {order.orderItems.reduce((sum, item) => sum + item.product.retailPrice * item.amount, 0)} &#8381;
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : Orders.renderOrdersTable(this.state.shipments);

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
        await axios.get("https://localhost:7157/orders")
            .then((response) =>
                this.setState({shipments: response.data, loading: false}))
    }
}
