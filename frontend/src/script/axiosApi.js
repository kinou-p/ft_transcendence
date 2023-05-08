// console.log(`toktoken= ${token}`)
import axios from 'axios';

// const token = localStorage.getItem('token');


async function getToken() {
	// your code to retrieve the token from localStorage or any other source
	const token = localStorage.getItem('token');
	return token;
}

console.log(`getToken = ${getToken()}`)

const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
	  Authorization: `Bearer ${await getToken()}`,
	},
  withCredentials: true,
});

export default api;