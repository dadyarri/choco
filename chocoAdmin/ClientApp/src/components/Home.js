import React, {Component} from 'react';
import axios from "axios";
import StatsByCityChart from "./Charts/StatsByCityChart";
import {TotalIncomes} from "./Charts/TotalIncomes";

export class Home extends Component {
    static displayName = Home.name;

    getStatsByCity = async () => {
        await axios.get("/api/Stats/ByCity").then(
            (response) => {
                this.setState({statsByCity: response.data})
            }
        )
    }

    getTotalIncomes = async () => {
        await axios.get("/api/Stats/CompareIncome").then(
            (response) => {
                this.setState({compareIncomes: response.data.incomeInfos})
            }
        )
    }

    constructor(props) {
        super(props);
        this.state = {statsByCity: [], compareIncomes: [{total: 0}, {total: 0}]};
    }

    async componentDidMount() {
        await this.getStatsByCity();
        await this.getTotalIncomes();
    }

    render() {
        return (
            <div>
                <h1>Статистика</h1>

                <div>
                    <h5>Продажи по городам</h5>
                    <StatsByCityChart data={this.state.statsByCity}/>
                </div>
                
                <div>
                    <h5>Общие продажи</h5>
                    <TotalIncomes data={this.state.compareIncomes}/>
                </div>
            </div>
        );
    }
}
