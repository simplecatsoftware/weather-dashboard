import React, {Component} from 'react';
import {
    Col, Container,
    Navbar, NavbarBrand,
    Row,
} from 'reactstrap';

import './App.scss';

class App extends Component {
    render() {
        return (
            <div>
                <Navbar expand={'sm'} light color={'light'}>
                    <NavbarBrand>Weather Dashboard</NavbarBrand>
                </Navbar>
                <Container>
                    <Row>
                        <Col>

                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
