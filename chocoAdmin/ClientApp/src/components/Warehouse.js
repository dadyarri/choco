import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import {GiWeight} from "react-icons/gi";
import axios from "axios";

export class Warehouse extends Component {
    static displayName = Warehouse.name;

    constructor(props) {
        super(props);
        this.state = {products: [], loading: true};
    }

    componentDidMount() {
        this.populateProductsData();
    }

    static renderProductsTable(products) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                <tr>
                    <th>Название</th>
                    <th>Цена</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product =>
                    <tr key={uuid()}>
                        <td>{product.name} {product.isByWeight ? <GiWeight/> : null}</td>
                        <td>{product.wholesalePrice} ({product.retailPrice}) &#8381;</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : Warehouse.renderProductsTable(this.state.products);

        return (
            <div>
                <h1 id="tableLabel">Склад</h1>
                {contents}
            </div>
        );
    }

    async populateProductsData() {
        await axios.get("https://localhost:7157/products")
            .then((response) =>
                this.setState({products: response.data, loading: false}
                )
            );
    }
}
