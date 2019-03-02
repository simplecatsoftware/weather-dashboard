import React, {Component} from 'react';
import {Col, Container, Row} from "reactstrap";
import ReactGA from "react-ga";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import Search from "./components/Search";
import Weather from "./components/Weather";

import './App.scss';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locations: [],
        };

        this.onLocationsUpdated = this.onLocationsUpdated.bind(this);

        ReactGA.initialize('UA-135470699-1');
        ReactGA.pageview(window.location.pathname);
    }

    componentDidMount() {
        let locations = [];

        try {
            locations = JSON.parse(localStorage.getItem('locations')) || [];
        } catch (e) {
        }

        this.setState(prevState => ({
            ...prevState,
            locations,
        }))
    }

    onLocationsUpdated(locations) {
        this.setState(prevState => {
            return {...prevState, locations};
        }, () => {
            localStorage.setItem('locations', JSON.stringify(locations));
        });
    }

    render() {
        return (
            <div style={{marginBottom: 75}}>
                <Menu>
                    <Search onLocationsUpdated={this.onLocationsUpdated}
                            selectedLocations={this.state.locations}
                    />
                </Menu>
                <Container fluid>
                    <Row>
                        {this.state.locations.map(location =>
                            <Col className={`mb-3`}
                                 key={`weather-${location.woeid}`}
                                 lg={4}
                                 md={6}
                                 sm={12}
                            >
                                <Weather location={location}/>
                            </Col>
                        )}
                    </Row>
                </Container>
                <Footer />
            </div>
        );
    }
}
