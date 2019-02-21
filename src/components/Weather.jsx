import React, {Component} from 'react';
import {Card, CardHeader} from "reactstrap";
import propTypes from '../propTypes';

export default class Weather extends Component {
    static propTypes = {
        location: propTypes.location,
    };

    render() {
        return (
            <Card>
                <CardHeader>
                    {this.props.location.title}
                </CardHeader>

            </Card>
        );
    }
}
