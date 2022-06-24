import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-rest-test.herokuapp.com',
});

export default api;
