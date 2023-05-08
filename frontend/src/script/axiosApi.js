// console.log(`toktoken= ${token}`)
import axios from 'axios';

// const token = localStorage.getItem('token');


function getToken() {
	// your code to retrieve the token from localStorage or any other source
	const token = localStorage.getItem('token');
	return token;
}

console.log(`getToken = ${getToken()}`)

const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
	  Authorization: `Bearer ${getToken()}`,
	},
  withCredentials: true,
});

export default api;