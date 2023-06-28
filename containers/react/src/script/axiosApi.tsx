
import axios from 'axios';

function getToken() {
	const token = localStorage.getItem('token');
	if (typeof token === 'string') {
		console.log("is a string !!!")
	  }
	return token;
}

console.log(`getToken = ${getToken()}`)
console.log(`Bearer ${localStorage.getItem("token")}`)
let api = axios.create({
baseURL: 'http://' + process.env.REACT_APP_BASE_URL + '/api', 
  headers: {
		Authorization : `Bearer ${localStorage.getItem("token")}`
	},
  withCredentials: true,
});

export default api;