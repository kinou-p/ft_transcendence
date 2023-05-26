// console.log(`toktoken= ${token}`)
import axios from 'axios';

// const token = localStorage.getItem('token');


function getToken() {
	// your code to retrieve the token from localStorage or any other source
	const token = localStorage.getItem('token');
	if (typeof token === 'string') {
		console.log("is a string !!!")
	  }
	return token;
}

console.log(`getToken = ${getToken()}`)
console.log(`Bearer ${localStorage.getItem("token")}`)

let api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
	//   Authorization: `Bearer ${getToken()}`,
		Authorization : `Bearer ${localStorage.getItem("token")}`
	},
  withCredentials: true,
});

export default api;