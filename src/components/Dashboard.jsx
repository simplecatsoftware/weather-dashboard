import React, {Component} from 'react';
import {Container, Row} from "reactstrap";
import Menu from "./Menu";
import Search from "./Search";

export default class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locations: [],
        };

        this.onLocationsUpdated = this.onLocationsUpdated.bind(this);
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
            <div>
                <Menu>
                    <Search onLocationsUpdated={this.onLocationsUpdated}
                            selectedLocations={this.state.locations}
                    />
                </Menu>
                <Container fluid>
                    <Row>

                    </Row>
                </Container>
            </div>
        );
    }
}
