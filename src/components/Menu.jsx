import React, {Component} from 'react';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler} from "reactstrap";

export default class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navIsOpen: false,
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            navIsOpen: !this.state.navIsOpen
        });
    }

    render() {
        return (
            <Navbar expand={'sm'} light color={'light'} className={'mb-3'}>
                <NavbarBrand>Weather Dashboard</NavbarBrand>
                <NavbarToggler onClick={this.toggle}/>
                <Collapse isOpen={this.state.navIsOpen} navbar>
                    <Nav className="ml-auto d-flex" navbar>
                        {this.props.children}
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
