import React, {Component} from 'react';

export class CreateShipment extends Component {
    static displayName = CreateShipment.name;

    constructor(props) {
        super(props);
        this.state = {currentCount: 0};
    }

    render() {
        return (
            <div>
                <h1>Создание поставки</h1>
            </div>
        );
    }
}
