import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiClockwork, GiSandsOfTime} from "react-icons/gi";
import {TbTruckDelivery} from "react-icons/tb";
import {HiDocumentMagnifyingGlass} from "react-icons/hi2";
import {Link} from "react-router-dom";

export class Shipments extends Component {
    static displayName = Shipments.name;

    constructor(props) {
        super(props);
        this.state = {shipments: [], loading: true};
    }

    componentDidMount() {
        this.populateShipmentsData();
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
    
    static getShipmentStatusIcon(status) {
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

    static renderShipmentsTable(shipments) {
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
                    {shipments.map(shipment =>
                        <tr key={uuid()}>
                            <td>{shipment.date} {this.getShipmentStatusIcon(shipment.status.name)}</td>
                            <td>
                                <ul>
                                    {shipment.shipmentItems.map(item =>
                                        <li key={uuid()}>{item.product.name} x{item.amount} {this.getShipmentItemStatusIcon(item.status.name)}</li>
                                    )}
                                </ul>
                            </td>
                            <td>
                                {shipment.shipmentItems.reduce((sum, item) => sum + item.product.wholesalePrice * item.amount, 0)} &#8381;
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
            : Shipments.renderShipmentsTable(this.state.shipments);

        return (
            <div>
                <h1 id="tableLabel">Поставки</h1>
                <div className={"btn-group"}>
                    <button className={"btn btn-primary"} onClick={() => this.populateShipmentsData()}>Обновить</button>
                    <Link className={"btn btn-success"} to={"/shipments/new"} >Создать</Link>
                </div>
                {contents}
            </div>
        );
    }

    async populateShipmentsData() {
        await axios.get("https://localhost:7157/shipments")
            .then((response) =>
                this.setState({shipments: response.data, loading: false}))
    }
}
