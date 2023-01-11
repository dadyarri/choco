import React, {Component} from 'react';
import axios from "axios";
import StatsByCityChart from "./Charts/StatsByCityChart";

export class Home extends Component {
    static displayName = Home.name;

    getStatsByCity = async () => {
        await axios.get("/api/Stats/ByCity").then(
            (response) => this.setState({statsByCity: response.data})
        )
    }

    constructor(props) {
        super(props);
        this.state = {statsByCity: []};
    }

    componentDidMount() {
        this.getStatsByCity()
    }

    render() {
        return (
            <div>
                <h1>Статистика</h1>
                
                <div>
                    <h5>Продажи по городам</h5>
                    <StatsByCityChart data={this.state.statsByCity}/>
                </div>
            </div>
        );
    }
}
