import axios from 'axios';

const api = axios.create({
    baseURL: 'http://*************:5000/api',
});

export { api }