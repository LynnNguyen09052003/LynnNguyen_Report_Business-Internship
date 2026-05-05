import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5175', //http://localhost:5175
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  },
});

export default API;
