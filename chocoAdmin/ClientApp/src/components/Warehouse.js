import React, {Component} from 'react';
import {v4 as uuid} from 'uuid';
import {GiWeight} from "react-icons/gi";
import axios from "axios";
import {Link} from "react-router-dom";
import {ImWarning} from "react-icons/im";
import {Button, ButtonGroup} from "reactstrap";
import {HiOutlineTrash, HiPencil} from "react-icons/hi2";
import $ from "jquery";

export class Warehouse extends Component {
    static displayName = Warehouse.name;
    productSchema = {};

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true,
            editModalData: this.productSchema,
            productCategories: []
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
    }

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

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : this.renderProductsTable(this.state.products);

        return (
            <div>
                <h1 id="tableLabel">Склад</h1>
                <div className={"btn-group"}>
                    <button className={"btn btn-primary"} onClick={() => this.populateProductsData()}>Обновить</button>
                    <Link className={"btn btn-success"} to={"/warehouse/new"}>Создать</Link>
                </div>
                {contents}
            </div>
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
