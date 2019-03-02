import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class WeatherIcon extends Component {
    static propTypes = {
        condition_long: PropTypes.oneOf(["Snow", "Sleet", "Hail", "Thunderstorm", "Heavy Rain", "Light Rain", "Showers", "Heavy Cloud", "Light Cloud", "Clear"]).isRequired,
        condition_short: PropTypes.oneOf(["sn", "sl", "h", "t", "hr", "lr", "s", "hc", "lc", "c"]).isRequired,
        className: PropTypes.string,
        caption: PropTypes.string,
    };

    render() {
        return (
            <img alt={`Weather icon for ${this.props.condition_long}`}
                 className={`${this.props.className} figure-img img-fluid`}
                 src={`https://www.metaweather.com/static/img/weather/${this.props.condition_short}.svg`}
            />
        );
    }
}
