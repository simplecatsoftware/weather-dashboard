import axios from "axios";

export default new class Api {
    _apiPrefix = 'http://localhost:4000/api';

    search(location) {
        return this._request(`${this._apiPrefix}/location/${location}`);
    }

    weather(woeid) {
        return this._request(`${this._apiPrefix}/weather/${woeid}`);
    }

    _request(url) {
        return axios.get(url)
            .then(response => response.data)
            .catch(error => {
                console.error(error);
            });
    }
}()
