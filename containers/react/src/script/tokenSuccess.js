import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function SuccessToken() {
  const location = useLocation();
  const { data } = queryString.parse(location.search);
//   localStorage data.token;
  const cleanData = data.slice(1, -1);
//   console.log(`prout token= ${cleanData}`)
  localStorage.setItem('token', `${cleanData}`);
  console.log(`prout token2= ${localStorage.getItem('token')}`)
  window.location.replace("http://localhost/pong");
  
//   return (
//     <div>
//       <h2>Success!</h2>
//       <p>Data: {data}</p>
//     </div>
//   );
}

export default SuccessToken;


// // Store a value in localStorage
// localStorage.setItem('key', 'value');

// // Retrieve a value from localStorage
// const value = localStorage.getItem('key');

// // Remove a value from localStorage
// localStorage.removeItem('key');

// // Clear all values from localStorage
// localStorage.clear();