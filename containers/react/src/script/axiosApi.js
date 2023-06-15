
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

const test = "192.168.1.19"
// const url = 'http://' + process.env.BASE_URL + '/api'
const url = 'http://' + test + '/api'

console.log("url= ", url)
console.log("env= ", process.env)
console.log("env= ", process.env.BASE_URL)

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