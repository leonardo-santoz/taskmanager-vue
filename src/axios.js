import axios from 'axios';
import config from './config/config';

const instance = axios.create({})

instance.defaults.baseURL = config.apiUrl;

export default instance;
