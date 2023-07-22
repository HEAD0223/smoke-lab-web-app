import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://188.127.231.48',
});

export default instance;
