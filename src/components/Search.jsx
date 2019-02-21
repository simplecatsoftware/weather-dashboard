import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {debounce} from "lodash";
import Api from '../libs/Api';

export default class Search extends Component {
    static propTypes = {
        onLocationsUpdated: PropTypes.func.isRequired,
        selectedLocations: PropTypes.arrayOf(PropTypes.shape({
            latt_long: PropTypes.string.isRequired,
            location_type: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            woeid: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })).isRequired
    };

    constructor(props) {
        super(props);

        this.state = {locations: [], loading: false, query: ''};

        this.onQueryChanged = debounce(this.onQueryChanged.bind(this), 200);
        this.onLocationsUpdated = this.onLocationsUpdated.bind(this);
    }

    onLocationsUpdated(locations) {
        this.props.onLocationsUpdated(locations);
        this.setState(prevState => ({
            ...prevState,
            locations: [],
        }));
    }

    onQueryChanged(query, event) {
        if (event.action === 'input-change') {
            const loading = !this.state.loading &&
                !this.state.locations.length &&
                query.length > 3;

            if (query.length < 4) {
                this.setState(prevState => ({
                    ...prevState,

                }));
            }

            this.setState(prevState => ({...prevState, query}), () => {
                if (loading) {
                    this.setState(prevState => ({...prevState, loading}));

                    Api.search(query)
                        .then(locations => {
                            this.setState(prevState => ({
                                ...prevState,
                                loading: false,
                                locations,
                            }));
                        })
                }
            });
        }
    }

    render() {
        return (
            <Select isLoading={this.state.loading}
                    isMulti
                    onChange={this.onLocationsUpdated}
                    onInputChange={this.onQueryChanged}
                    options={this.state.locations.map(location => ({
                        ...location,
                        label: location.title,
                        value: location.woeid
                    }))}
                    placeholder={'Search for a location...'}
                    styles={{
                        container: (style) => ({
                            ...style,
                            flexGrow: 1,
                            flexShrink: 1,
                            flexBasis: 'auto',
                            minWidth: 200,
                        })
                    }}
                    value={this.props.selectedLocations}
            />
        );
    }
}
