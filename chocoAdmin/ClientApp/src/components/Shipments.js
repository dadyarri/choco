import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import {GiWeight} from "react-icons/gi";
import axios from "axios";

export class Shipments extends Component {
    static displayName = Shipments.name;

    constructor(props) {
        super(props);
        this.state = {products: [], loading: true};
    }

    componentDidMount() {
        this.populateShipmentsData();
    }

    static renderShipmentsTable(shipments) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Цена</th>
                    <th>Остаток</th>
                </tr>
                </thead>
                <tbody>
                {shipments.map(shipment =>
                    <tr key={uuid()}>
                        <td>{shipment.name} {shipment.isByWeight ? <GiWeight/> : null}</td>
                        <td>{shipment.wholesalePrice} ({shipment.retailPrice}) &#8381;</td>
                        <td>{shipment.leftover} {shipment.isByWeight ? 'кг.' : 'шт.'}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : Shipments.renderShipmentsTable(this.state.products);

        return (
            <div>
                <h1 id="tableLabel">Поставки</h1>
                {contents}
            </div>
        );
    }

    async populateShipmentsData() {
        await axios.get("https://localhost:7157/products")
            .then((response) =>
                this.setState({products: response.data, loading: false}
                )
            );
    }
}
