
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

const url = 'http://' + process.env.BASE_URL + '/api'

console.log("url= ", url)

let api = axios.create({
//   baseURL: 'http://localhost/api', 
baseURL: 'http://' + process.env.BASE_URL + '/api', 
  headers: {
	//   Authorization: `Bearer ${getToken()}`,
		Authorization : `Bearer ${localStorage.getItem("token")}`
	},
  withCredentials: true,
});

export default api;