import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import axios from "axios";
import {GiCancel, GiCheckMark, GiClockwork} from "react-icons/gi";
import {TbReplace} from "react-icons/tb";

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

    static renderShipmentsTable(shipments) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                <tr>
                    <th>Дата</th>
                    <th>Содержимое заказа</th>
                </tr>
                </thead>
                <tbody>
                {shipments.map(shipment =>
                    <tr key={uuid()}>
                        <td>{shipment.date}</td>
                        <td>
                            <ul>
                                {shipment.shipmentItems.map(item =>
                                    <li key={uuid()}>{item.product.name} x{item.amount} {this.getShipmentItemStatusIcon(item.status.name)}</li>
                                )}
                            </ul>
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
