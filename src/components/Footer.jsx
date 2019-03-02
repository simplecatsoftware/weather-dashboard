import React, {Component} from 'react';
import {Navbar} from "reactstrap";

export default class Footer extends Component {
    render() {
        return (
            <Navbar color="faded" light fixed={'bottom'}>
                <div className={'navbar-text text-center mx-auto'}>
                    Developed by Simple Cat Software<br/>
                    Powered by data from <a href={'https://www.metaweather.com/'} target={'_blank'}>MetaWeather</a>
                </div>
            </Navbar>
        );
    }
}
