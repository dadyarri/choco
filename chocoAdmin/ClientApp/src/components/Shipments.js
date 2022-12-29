import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiClockwork, GiSandsOfTime} from "react-icons/gi";
import {TbReplace, TbTruckDelivery} from "react-icons/tb";
import {HiDocumentMagnifyingGlass} from "react-icons/hi2";

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
            case "Заменено": {
                return <TbReplace/>
            }
            case "Отменено": {
                return <GiCancel/>
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
        }
    }

    static renderShipmentsTable(shipments) {
        return (
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
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : Shipments.renderShipmentsTable(this.state.shipments);

        return (
            <div>
                <h1 id="tableLabel">Поставки</h1>
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
