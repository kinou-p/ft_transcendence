import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function SuccessToken() {
  const location = useLocation();
  const { data } = queryString.parse(location.search);
  const cleanData = data.slice(1, -1);
  localStorage.setItem('token', `${cleanData}`);
  console.log(`token= ${localStorage.getItem('token')}`)
  window.location.replace("http://" + process.env.REACT_APP_BASE_URL + "/pong");
}

export default SuccessToken;