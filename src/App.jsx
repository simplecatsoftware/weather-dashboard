import React, {Component} from 'react';
import {
    Col, Collapse, Container,
    Nav, Navbar, NavbarBrand, NavbarToggler, NavLink,
    Row
} from 'reactstrap';

import './App.scss';

class App extends Component {
    render() {
        return (
            <div>
                <Navbar expand={'sm'} light>
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
