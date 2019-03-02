import React, {Component} from 'react';
import {get} from 'lodash';
import {Card, CardHeader} from "reactstrap";
import propTypes from '../propTypes';
import Api from '../Api';

export default class Weather extends Component {
    static propTypes = {
        location: propTypes.location,
    };

    constructor(props) {
        super(props);

        this.state = {weather: null};

        this.getWeather = this.getWeather.bind(this);
        this.setWeather = this.setWeather.bind(this);
    }

    componentDidMount() {
        this.getWeather();
    }

    getWeather() {
        let weather = null;

        try {
            weather = JSON.parse(localStorage.getItem(`weather-${this.props.location.woeid}`));
        } catch (e) {
        }

        if (
            weather
            && get(weather, 'consolidated_weather[0].applicable_date') === (new Date()).toJSON().slice(0, 10)
        ) {
            return this.setWeather(weather);
        }

        Api.weather(this.props.location.woeid)
            .then(weather => {
                this.setWeather(weather);
            });
    }

    setWeather(weather) {
        localStorage.setItem(`weather-${this.props.location.woeid}`, JSON.stringify(weather));
        this.setState(prevState => ({
            ...prevState,
            weather,
        }));
    }

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
