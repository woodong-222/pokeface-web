import axios from 'axios';

const publicAxios = axios.create({
	baseURL: `${import.meta.env.VITE_SERVER_URL}`,
});

export default publicAxios;
