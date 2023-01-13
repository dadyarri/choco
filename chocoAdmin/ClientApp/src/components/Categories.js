import React, {Component} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

export class Categories extends Component {
    static displayName = Categories.name;

    constructor(props) {
        super(props);
        this.state = {categories: [], loading: true};
    }

    componentDidMount() {
        this.populateCategoriesData();
    }

    static renderCategoriesTable(categories) {
        return (
            <table className="table table-striped" aria-labelledby="tableLabel">
                <thead>
                <tr>
                    <th>Название</th>
                </tr>
                </thead>
                <tbody>
                {categories.map(category =>
                    <tr key={category.id}>
                        <td>{category.name}</td>
                    </tr>
                )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Загрузка...</em></p>
            : Categories.renderCategoriesTable(this.state.products);

        return (
            <div>
                <h1 id="tableLabel">Категории товара</h1>
                <div className={"btn-group"}>
                    <button className={"btn btn-primary"} onClick={() => this.populateCategoriesData()}>Обновить</button>
                    <Link className={"btn btn-success"} to={"/categories/new"} >Создать</Link>
                </div>
                {contents}
            </div>
        );
    }

    async populateCategoriesData() {
        await axios.get("/api/productCategories")
            .then((response) =>
                this.setState({products: response.data, loading: false}
                )
            );
    }
}
