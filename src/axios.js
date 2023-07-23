import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://h5miracle.ru',
});

export default instance;
