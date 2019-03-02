import React, {Component} from 'react';
import {get} from 'lodash';
import {Card, CardBody} from "reactstrap";
import moment from 'moment';
import propTypes from '../propTypes';
import Api from '../Api';
import WeatherIcon from "./WeatherIcon";

export default class Weather extends Component {
    static propTypes = {
        location: propTypes.location,
    };

    constructor(props) {
        super(props);

        this.state = {weather: []};

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
        } catch (e) { }

        if (
            weather
            && get(weather, 'consolidated_weather[0].applicable_date') === (new Date()).toJSON().slice(0, 10)
        ) {
            return this.setWeather(weather);
        }

        Api.weather(this.props.location.woeid, new Date())
            .then(weather => this.setWeather(weather))
            .catch(error => {
                console.log(error);
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
                <CardBody>
                    {this.state.weather.length > 0 &&
                        <div className="media">
                            <WeatherIcon className={`align-self-center mr-3`}
                                         condition_long={this.state.weather[0].weather_state_name}
                                         condition_short={this.state.weather[0].weather_state_abbr}
                                         featured
                            />
                            <div className="media-body text-right my-auto">
                                <h2>{this.props.location.title}</h2>
                                <h3>{this.state.weather[0].the_temp.toFixed(0)}&deg;C</h3>
                                <h4>
                                    {this.state.weather[0].weather_state_name}&nbsp;
                                    {moment(this.state.weather[0].applicable_date).calendar().split(' ')[0]}
                                </h4>
                                <h5>Accuracy {this.state.weather[0].predictability.toFixed(0)}%</h5>
                            </div>
                        </div>
                    }
                </CardBody>
            </Card>
        );
    }
}
