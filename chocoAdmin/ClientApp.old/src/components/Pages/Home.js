import React, {Component} from 'react';
import axios from "axios";
import {ResponsiveContainer} from "recharts";
import StatsPieChart from "../Charts/StatsPieChart";
import {CompareIncomes} from "../Charts/CompareIncomes";
import {IncomesChart} from "../Charts/IncomesChart";
import {TopProducts} from "../Charts/TopProducts";

export class Home extends Component {
    static displayName = Home.name;

    getStatsByCity = async () => {
        await axios.get("/api/Stats/ByCity").then(
            (response) => {
                this.setState({statsByCity: response.data})
            }
        )
    }
    
    getTopProducts = async () => {
        await axios.get("/api/Stats/TopProducts").then(
            (response) => {
                this.setState({topProducts: response.data})
            }
        )
    }
    
    getCategories = async () => {
        await axios.get("/api/Stats/Categories").then(
            (response) => {
                this.setState({categories: response.data})
            }
        )
    }

    getTotalIncomesFor2Months = async () => {
        await axios.get("/api/Stats/TotalIncomes/2").then(
            (response) => {
                this.setState({incomesFor2: response.data})
            }
        )
    }

    getTotalIncomesFor10Months = async () => {
        await axios.get("/api/Stats/TotalIncomes/10").then(
            (response) => {
                this.setState({incomesFor10: response.data})
            }
        )
    }

    constructor(props) {
        super(props);
        this.state = {
            statsByCity: [],
            incomesFor2: [{total: 0}, {total: 0}],
            incomesFor10: [{dateInfo: '', total: 0}, {dateInfo: '', total: 0}],
            topProducts: [{name: '', value: 0}],
            categories: [{name: '', value: 0}]
        };
    }

    async componentDidMount() {
        await this.getStatsByCity();
        await this.getTotalIncomesFor2Months();
        await this.getTotalIncomesFor10Months();
        await this.getTopProducts();
        await this.getCategories();
    }

    render() {
        return (
            <div>
                <h1>Статистика</h1>

                <div className="row">
                    <div className={"col"}>
                        <h5>Продажи по городам</h5>
                        <StatsPieChart data={this.state.statsByCity}/>
                    </div>

                    <div className={"col"}>
                        <h5>Общие продажи</h5>
                        <CompareIncomes data={this.state.incomesFor2}/>
                    </div>

                    <div className={"col"}>
                        <h5>Сравнение продаж</h5>
                        <IncomesChart data={this.state.incomesFor10}/>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col">
                        <h5>Самые продаваемые сорта</h5>
                        <TopProducts data={this.state.topProducts}/>
                    </div>
                    
                    <div className="col">
                        <h5>Продажи по категориям</h5>
                        <ResponsiveContainer width={"100%"} height={"100%"}>
                            <StatsPieChart data={this.state.categories}/>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
}