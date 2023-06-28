
import axios from 'axios';

let api = axios.create({
baseURL: 'http://' + process.env.REACT_APP_BASE_URL + '/api', 
  headers: {
		Authorization : `Bearer ${localStorage.getItem("token")}`
	},
  withCredentials: true,
});

export default api;