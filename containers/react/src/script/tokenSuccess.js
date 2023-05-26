import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function SuccessToken() {
  const location = useLocation();
  const { data } = queryString.parse(location.search);
  const cleanData = data.slice(1, -1);
  localStorage.setItem('token', `${cleanData}`);
  console.log(`prout token2= ${localStorage.getItem('token')}`)
  window.location.replace("http://localhost/pong");
}

export default SuccessToken;