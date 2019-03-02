import PropTypes from "prop-types";

const location = PropTypes.shape({
    latt_long: PropTypes.string.isRequired,
    location_type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    woeid: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
}).isRequired;

const locations = PropTypes.arrayOf(location);

export default {
    location,
    locations,
};
